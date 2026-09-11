
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'E-commerce API',
            version: '1.0.0',
            description: 'REST API documentation for the E-commerce platform'
        },

        servers: [
            {
                url: 'http://localhost:8000/api/v1',
                description: 'Local development server'
            }
        ],

        tags: [
            {
                name: 'auth',
                description: 'Authentication endpoints'
            },
            {
                name: 'users',
                description: 'Admin user management endpoints'
            },
            {
                name: 'orders',
                description: 'Customer order management endpoints'
            },
    {
    name: 'products',
    description: 'Product management endpoints'
}
        ],

        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '66c8f1a2b3c4d5e6f7a8b9c0'
                        },
                        name: {
                            type: 'string',
                            example: 'John Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['customer', 'admin'],
                            example: 'customer'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },

                SignupInput: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 2,
                            example: 'John Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            minLength: 8,
                            example: 'password123'
                        }
                    }
                },

                LoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com'
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'password123'
                        }
                    }
                },

                UpdateUserInput: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 2,
                            example: 'John Updated'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.updated@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['customer', 'admin'],
                            example: 'admin'
                        }
                    }
                },

                OrderItem: {
                    type: 'object',
                    properties: {
                        product: {
                            type: 'string',
                            description: 'Product ID',
                            example: '65f1a2b3c4d5e6f7a8b9c0d1'
                        },
                        quantity: {
                            type: 'integer',
                            minimum: 1,
                            description: 'Quantity ordered',
                            example: 2
                        },
                        price: {
                            type: 'number',
                            description: 'Price at time of order',
                            example: 29.99
                        }
                    }
                },

                OrderItemPopulated: {
                    type: 'object',
                    properties: {
                        product: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '65f1a2b3c4d5e6f7a8b9c0d1'
                                },
                                name: {
                                    type: 'string',
                                    example: 'Wireless Headphones'
                                },
                                price: {
                                    type: 'number',
                                    example: 29.99
                                },
                                imageUrl: {
                                    type: 'string',
                                    example: 'https://example.com/image.jpg'
                                }
                            }
                        },
                        quantity: {
                            type: 'integer',
                            example: 2
                        },
                        price: {
                            type: 'number',
                            example: 29.99
                        }
                    }
                },

                Order: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Order ID',
                            example: '66c8f1a2b3c4d5e6f7a8b9c0'
                        },
                        customer: {
                            type: 'string',
                            description: 'Customer ID',
                            example: '66c8f1a2b3c4d5e6f7a8b9c1'
                        },
                        items: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/OrderItem'
                            }
                        },
                        totalPrice: {
                            type: 'number',
                            description: 'Total order price',
                            example: 59.98
                        },
                        status: {
                            type: 'string',
                            enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
                            description: 'Order status',
                            example: 'Pending'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Order creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Order last update timestamp'
                        }
                    }
                },

                OrderWithCustomer: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '66c8f1a2b3c4d5e6f7a8b9c0'
                        },
                        customer: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '66c8f1a2b3c4d5e6f7a8b9c1'
                                },
                                name: {
                                    type: 'string',
                                    example: 'John Doe'
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'john@example.com'
                                }
                            }
                        },
                        items: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/OrderItem'
                            }
                        },
                        totalPrice: {
                            type: 'number',
                            example: 59.98
                        },
                        status: {
                            type: 'string',
                            enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
                            example: 'Pending'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },

                OrderDetailed: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '66c8f1a2b3c4d5e6f7a8b9c0'
                        },
                        customer: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string',
                                    example: '66c8f1a2b3c4d5e6f7a8b9c1'
                                },
                                name: {
                                    type: 'string',
                                    example: 'John Doe'
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'john@example.com'
                                }
                            }
                        },
                        items: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/OrderItemPopulated'
                            }
                        },
                        totalPrice: {
                            type: 'number',
                            example: 59.98
                        },
                        status: {
                            type: 'string',
                            enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
                            example: 'Pending'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },

                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error'
                        },
                        message: {
                            type: 'string',
                            example: 'Something went wrong'
                        }
                    }
                }
            },

            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },

                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'jwt'
                }
            }
        }
    },

apis: ['./routes/*.js']};

const specs = swaggerJSDoc(swaggerOptions);

module.exports = specs;