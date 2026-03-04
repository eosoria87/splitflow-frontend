import friendsPhoto from '../../assets/friends-table.png';


const SlideOne = () => {
  return (
    <div className='flex flex-col items-center lg:flex-row-reverse lg:justify-center lg:gap-16 animate-fadeIn'>
      
      <div className='flex flex-col items-center lg:items-start'>
        <h1 className='text-4xl font-bold text-center lg:text-left w-[320px] lg:w-auto lg:max-w-md'> 
          Stop the awkward money talk.
        </h1>
        <p className='text-primary text-center lg:text-left mt-4 mb-4 lg:mb-0 w-[320px] sm:w-md lg:w-auto lg:max-w-md'>
          Let SplitFlow handle the math so you can focus on the memories. Track, split, and settle up in seconds.
        </p>
      </div>

      <img 
        src={friendsPhoto} 
        alt='Friends eating' 
        className='bg-secondary p-3 rounded-2xl w-[332px] h-[332px] sm:w-[448px] sm:h-[448px] object-cover'
      />
      
    </div>
  );
};

export default SlideOne;

