const { GoogleGenerativeAI } = require("@google/generative-ai");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateProductDescription = catchAsync(async (req, res, next) => {
    const { name, category, info } = req.body;

    if (!name) {
        return next(new AppError("Product name is required", 400));
    }

    if (!info && !category) {
        return next(new AppError("Please provide product information or category", 400));
    }

    if (name.trim() === "" || (info && info.trim() === "")) {
        return next(new AppError("Input cannot be empty", 400));
    }

    if (name.length > 200 || (info && info.length > 2000)) {
        return next(new AppError("Input is too long", 400));
    }

    if (!process.env.GEMINI_API_KEY) {
        return next(new AppError("Gemini API key is not configured", 500));
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash",
        });

        const prompt =
            `
            You are a professional product copywriter.
            Generate a short, user-friendly product description (2-3 sentences max).
            Product Name: ${name}
            Category: ${category || "General"}
            Additional Info: ${info || "N/A"}
            Write only the description, no extra text.
            `;

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error("Gemini API timeout")),
                15000
            )
        );

        const result = await Promise.race([
            model.generateContent(prompt),
            timeoutPromise,
        ]);

        const response = await result.response;
        const description = response.text().trim();

        if (!description) {
            return next(new AppError("Gemini returned an empty response", 500));
        }

        res.status(200).json({
            status: "success",
            message: "Description generated successfully",
            data: {
                name,
                category: category || "General",
                description,
            },
        });
    } catch (error) {
        console.error("❌ AI Error:", error.message);

        if (error.message.includes("429") || error.message.toLowerCase().includes("quota")) {
            return next(new AppError("Rate limit exceeded. Please try again later.", 429));
        }

        if (error.message.includes("API_KEY_INVALID") || error.message.includes("401") || error.message.includes("403")) {
            return next(new AppError("Invalid Gemini API key", 401));
        }

        if (error.message.toLowerCase().includes("timeout")) {
            return next(new AppError("Gemini API timeout. Please try again.", 504));
        }

        if (error.message.includes("503") || error.message.toLowerCase().includes("unavailable")) {
            return next(new AppError("Gemini service is temporarily unavailable", 503));
        }

        return next(new AppError("Failed to generate product description", 500));
    }
});