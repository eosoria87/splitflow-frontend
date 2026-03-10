
interface Props extends React.PropsWithChildren {
	columnsNum: number;
}

const colMap: Record<number, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
};

const MainContainer = ({ columnsNum=2, children }: Props) => {
  return (
		<div className={`xl:pl-64 sm:px-8 grid grid-cols-1 ${colMap[columnsNum]} gap-8 items-start`}>
    	{ children } 
    </div>
  );
};

export default MainContainer;

