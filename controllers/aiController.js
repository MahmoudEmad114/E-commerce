const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================
// POST /api/ai/generate-product-description
// ============================================
exports.generateProductDescription = async (req, res) => {
    try {
        const { name, category, info } = req.body;

        // ✅ Edge Case 1: Missing product name
        if (!name) {
            return res.status(400).json({ 
                error: 'Product name is required' 
            });
        }

        // ✅ Edge Case 2: Missing product information
        if (!info && !category) {
            return res.status(400).json({ 
                error: 'Please provide product information or category' 
            });
        }

        // ✅ Edge Case 3: Empty input
        if (name.trim() === '' || (info && info.trim() === '')) {
            return res.status(400).json({ 
                error: 'Input cannot be empty' 
            });
        }

        // ✅ Edge Case 4: Very long input
        if (name.length > 200 || (info && info.length > 2000)) {
            return res.status(400).json({ 
                error: 'Input is too long' 
            });
        }

        // ✅ Edge Case 5: Missing API key
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ 
                error: 'Gemini API key is not configured' 
            });
        }

        // تهيئة الموديل
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // الـ Prompt
        const prompt = `
            You are a professional product copywriter.
            Generate a short, user-friendly product description (2-3 sentences max).
            
            Product Name: ${name}
            Category: ${category || 'General'}
            Additional Info: ${info || 'N/A'}
            
            Write only the description, no extra text.
        `;

        // إرسال الطلب لـ Gemini (مع Timeout)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API timeout')), 15000)
        );

        const result = await Promise.race([
            model.generateContent(prompt),
            timeoutPromise
        ]);

        const response = await result.response;
        const description = response.text().trim();

        // ✅ Edge Case 6: Empty AI response
        if (!description) {
            return res.status(500).json({ 
                error: 'Gemini returned an empty response' 
            });
        }

        res.status(200).json({
            message: 'Description generated successfully',
            name,
            category: category || 'General',
            description
        });

    } catch (error) {
        console.error('❌ AI Error:', error.message);

        // ✅ Edge Case 7: Rate limit
        if (error.message.includes('429') || error.message.includes('quota')) {
            return res.status(429).json({ 
                error: 'Rate limit exceeded. Please try again later.' 
            });
        }

        // ✅ Edge Case 8: Invalid API key
        if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
            return res.status(401).json({ 
                error: 'Invalid Gemini API key' 
            });
        }

        // ✅ Edge Case 9: Timeout
        if (error.message.includes('timeout')) {
            return res.status(504).json({ 
                error: 'Gemini API timeout. Please try again.' 
            });
        }

        // ✅ Edge Case 10: Gemini unavailable
        if (error.message.includes('503') || error.message.includes('unavailable')) {
            return res.status(503).json({ 
                error: 'Gemini service is temporarily unavailable' 
            });
        }

        // أي خطأ تاني
        res.status(500).json({ 
            error: 'Failed to generate description',
            details: error.message 
        });
    }
};