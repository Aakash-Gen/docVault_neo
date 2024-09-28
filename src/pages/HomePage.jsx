import { useEffect } from "react";

const HomePage = () => {

  const redirect = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      console.log(`You're connected to: ${accounts[0]}`);
      window.location.href = '/myfiles';
    } else {
      console.log("Metamask is not connected");
      window.location.href = '/login';
    }
  }

  useEffect(() => {
    redirect();
  },[]);

  return (
    <div>
      <h1>Redirecting..</h1>
    </div>
  );
}

export default HomePage;