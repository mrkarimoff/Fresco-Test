import { NavigationBar } from './_components/NavigationBar';
import ResetButton from './_components/ResetButton';

function Home() {
  return (
    <>
      <NavigationBar />
      <main className="mx-auto flex w-[80%] max-w-[1200px] flex-col gap-10 p-10">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Welcome</h1>
          <p>This is the main dashboard.</p>
          <ResetButton />
        </div>
      </main>
    </>
  );
}

export default Home;
