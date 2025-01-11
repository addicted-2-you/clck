interface Props {
  clicksCount: number;
}

export const LiveClicks = ({ clicksCount }: Props) => {
  if (!clicksCount) {
    return null;
  }

  return (
    <p className="absolute right-0 bottom-5 left-0 m-auto w-fit text-7xl">
      {clicksCount}
    </p>
  );
};
