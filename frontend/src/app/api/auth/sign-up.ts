import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const { email, password, data } = req.body;

		// Simulate user creation logic
		if (email && password) {
			return res.status(200).json({
				data: { message: "User created successfully" },
				error: null,
			});
		}

		return res.status(400).json({
			data: null,
			error: { message: "Invalid input" },
		});
	}

	// Handle unsupported methods
	return res.status(405).json({
		data: null,
		error: { message: "Method not allowed" },
	});
}
