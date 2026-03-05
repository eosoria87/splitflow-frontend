import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import SlideOne from "../components/onboarding/SlideOne";
import SlideTwo from "../components/onboarding/SlideTwo";
import SlideThree from "../components/onboarding/SlideThree";
import Button from "../components/ui/Button";
import NavBarOnboarding from "../components/navigation/NavBarOnboarding";


const OnboardingPage = () => {
	const [currentStep, setCurrentStep] = useState<number>(0);
	const slides = [<SlideOne />, <SlideTwo />, <SlideThree />];
	const navigate = useNavigate();

	const handleNext = () => {
		if (currentStep < slides.length - 1)
			setCurrentStep(s => s + 1);
		else
			navigate('/login');
	};
	return (
		<div className="h-[calc(100vh-4rem)] flex flex-col w-full">
			<NavBarOnboarding onClick={() => navigate('/login')} />
			<div className="flex-1 sm:w-full flex flex-col items-center p-6">
				<div className="rounded-4xl flex-1 flex items-center justify-center w-full overflow-hidden">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentStep}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.2 }}
							className="w-full flex justify-center"
						>
							{slides[currentStep]}
						</motion.div>
					</AnimatePresence>
				</div>
				<div className="flex gap-2 my-8 ">
					{[0, 1, 2].map(i => (
						<div
							key={i}
							className={`h-2 w-2 rounded-full ${currentStep === i ? 'bg-primary' : 'bg-secondary'}`}
						/>
					))}
				</div>
				<div className="flex w-full items-center justify-center max-w-md gap-4 ">
					<AnimatePresence>
						{currentStep > 0 &&
							(
								<motion.div
									key="back-button"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.2 }}
								>
									<Button variant="transparent" onClick={() => setCurrentStep(s => s - 1)}>
										Back
									</Button>
								</motion.div>
							)
						}
					</AnimatePresence>
					<Button variant="primary" onClick={handleNext}>
						{currentStep === 2 ? "Get Started" : "Next"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default OnboardingPage;

