import { useUpdateClicksMutation } from '../../services';

export const HomePage = () => {
  const [updateClicks] = useUpdateClicksMutation();

  const onClick = async () => {
    await updateClicks({ clicksCount: 1 });
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      <button className="hover:underline" onClick={onClick}>
        Click!
      </button>
    </div>
  );
};
