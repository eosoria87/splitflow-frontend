// Inside SlideTwo.tsx

const ExpenseTicket = () => {
  return (
		<div className="bg-white rounded-xl shadow-xl w-[280px] p-6 border-t-8 border-primary transform-gpu -rotate-6">
      
      <div className="border-b-2 border-dashed border-gray-200 pb-4 mb-4 text-center">
        <h3 className="text-xl font-bold text-gray-800">Tacos & Drinks</h3>
        <p className="text-sm text-gray-500">Today at 8:30 PM</p>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-600 mb-6">
        <div className="flex justify-between">
          <span>Tacos (x4)</span>
          <span className="font-medium">$16.00</span>
        </div>
        <div className="flex justify-between">
          <span>Margaritas (x2)</span>
          <span className="font-medium">$18.00</span>
        </div>
        <div className="flex justify-between">
          <span>Tip</span>
          <span className="font-medium">$6.00</span>
        </div>
      </div>

      <div className="bg-secondary/30 rounded-lg p-3 flex justify-between items-center text-primary font-bold text-lg">
        <span>Total</span>
        <span>$40.00</span>
      </div>
    </div>
  );
};

const SlideTwo = () => {
  return (
    <div className='flex flex-col items-center lg:flex-row lg:justify-center lg:gap-16 animate-fadeIn'>
      
      <div className="flex bg-secondary sm:w-[448px] sm:h-[448px] w-[332px] h-[332px] justify-center items-center rounded-2xl p-8">
        <ExpenseTicket />
      </div>

      <div className='flex flex-col items-center lg:items-start'>
        <h1 className='mt-4 lg:mt-0 text-4xl font-bold text-center lg:text-left w-[320px] sm:w-md lg:w-auto lg:max-w-md'> 
          Track every taco and trip.
        </h1>
        <p className='text-primary text-center lg:text-left mt-4 w-[320px] sm:w-md lg:w-auto lg:max-w-md'>
          SplitFlow handles multi-currency and group splits effortlessly, wherever your adventures take you.
        </p>
      </div>

    </div>
  );
};

export default SlideTwo;
