const schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "definitions": {},
    "id": "http://example.com/example.json",
    "properties": {
        "dependencies": {
            "id": "/properties/dependencies",
            "properties": {
                "children": {
                    "id": "/properties/dependencies/properties/children",
                    "items": {
                        "id": "/properties/dependencies/properties/children/items",
                        "properties": {
                            "children": {
                                "id": "/properties/dependencies/properties/children/items/properties/children",
                                "items": {
                                    "id": "/properties/dependencies/properties/children/items/properties/children/items",
                                    "properties": {
                                        "name": {
                                            "id": "/properties/dependencies/properties/children/items/properties/children/items/properties/name",
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                },
                                "type": "array"
                            },
                            "name": {
                                "id": "/properties/dependencies/properties/children/items/properties/name",
                                "type": "string"
                            }
                        },
                        "type": "object"
                    },
                    "type": "array"
                },
                "name": {
                    "id": "/properties/dependencies/properties/name",
                    "type": "string"
                }
            },
            "type": "object"
        },
        "description": {
            "id": "/properties/description",
            "type": "string"
        },
        "forks": {
            "id": "/properties/forks",
            "items": {
                "id": "/properties/forks/items",
                "type": "string"
            },
            "type": "array"
        },
        "outdatedDependencies": {
            "id": "/properties/outdatedDependencies",
            "items": {
                "id": "/properties/outdatedDependencies/items",
                "type": "null"
            },
            "type": "array"
        },
        "scores": {
            "id": "/properties/scores",
            "items": {
                "id": "/properties/scores/items",
                "items": {
                    "id": "/properties/scores/items/items",
                    "type": "string"
                },
                "type": "array"
            },
            "type": "array"
        },
        "stars": {
            "id": "/properties/stars",
            "items": {
                "id": "/properties/stars/items",
                "type": "string"
            },
            "type": "array"
        },
        "subScores": {
            "id": "/properties/subScores",
            "items": {
                "id": "/properties/subScores/items",
                "items": {
                    "id": "/properties/subScores/items/items",
                    "items": {
                        "id": "/properties/subScores/items/items/items",
                        "type": "string"
                    },
                    "type": "array"
                },
                "type": "array"
            },
            "type": "array"
        },
        "title": {
            "id": "/properties/title",
            "items": {
                "id": "/properties/title/items",
                "items": {
                    "id": "/properties/title/items/items",
                    "type": "string"
                },
                "type": "array"
            },
            "type": "array"
        }
    },
    "type": "object"
};

exports.schema = schema;
