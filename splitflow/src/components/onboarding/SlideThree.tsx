import SettlementSuccess from "../ui/SettlementSucess";

const SlideThree = () => {
  return (
     // Using the same lg:flex-row-reverse pattern as Slide 1 for visual variety
    <div className='flex flex-col items-center lg:flex-row-reverse lg:justify-center lg:gap-20 animate-fadeIn px-4'>
      
      <div className="flex bg-secondary sm:w-[448px] sm:h-[448px] w-[332px] h-[302px] justify-center items-center rounded-2xl p-8 shadow-inner relative overflow-hidden">
         {/* Optional: Add a subtle background glow effect */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-mint/30 rounded-full blur-3xl"></div>
         
         {/* The Component Instantiated */}
         <SettlementSuccess />
      </div>

      {/* --- Text Container --- */}
      <div className='flex flex-col items-center lg:items-start z-10'>
        <h1 className='mt-4 lg:mt-0 text-4xl font-bold text-center lg:text-left w-[320px] lg:w-auto lg:max-w-md text-gray-900 leading-tight'> 
          Settle up with just one tap.
        </h1>
        <p className='text-primary text-center lg:text-left mt-6 w-[320px] sm:w-md lg:w-auto lg:max-w-lg text-lg leading-relaxed'>
          No more confusing bank transfers. SplitFlow calculates the easiest way to pay everyone back instantly.
        </p>
      </div>

    </div>
  );
};

export default SlideThree;
