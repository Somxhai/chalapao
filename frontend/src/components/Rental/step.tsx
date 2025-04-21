import { Fragment } from "react";

const Step = (step: number) => {
	return (
		<div className="flex justify-center items-center gap-6 md:mt-6 md:mb-4 mx-auto text-sm">
			{[1, 2, 3, 4].map((currentStep) => (
				<Fragment key={`step-${currentStep}`}>
					<div
						className={`flex items-center gap-2 ${
							currentStep <= step ? "" : "text-gray-400"
						}`}
					>
						<a
							href={
								currentStep == 1
									? `http://localhost:3000/rental/confirm/550e8400-e29b-41d4-a716-446655440000`
									: currentStep == 2
									? `http://localhost:3000/rental/pending/1a2b3c4d-5e6f-7g8h-9i0j-1a2b3c4d5e6f`
									: currentStep == 3
									? `http://localhost:3000/rental/payment/1a2b3c4d-5e6f-7g8h-9i0j-1a2b3c4d5e6f`
									: `http://localhost:3000/rental/success/1a2b3c4d-5e6f-7g8h-9i0j-1a2b3c4d5e6f`
							}
							className={`w-6 h-6 leading-3 rounded-full flex items-center justify-center ${
								currentStep <= step
									? "bg-black text-white"
									: "border border-gray-400"
							}`}
						>
							{currentStep}
						</a>
						{/* <div
							className={`w-6 h-6 leading-3 rounded-full flex items-center justify-center text-xs ${
								currentStep <= step
									? "bg-black text-white"
									: "border border-gray-400"
							}`}
						>
							{currentStep}
						</div> */}
						<span>
							{
								["Details", "Confirming", "Payment", "Done"][
									currentStep - 1
								]
							}
						</span>
					</div>
					{currentStep !== 4 && (
						<hr className="w-10 border-t border-gray-300" />
					)}
				</Fragment>
			))}
		</div>
	);
};

export default Step;
