import Web3 from 'web3';

export async function signMessage() {
  if (!window.ethereum) return alert("Please Install Metamask");

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

  // message to sign
  const message = "Sign to verify your identity";
  console.log({ message });

  const hashedMessage = Web3.utils.sha3(message);
  console.log({ hashedMessage });

  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [hashedMessage, accounts[0]],
  });

  // split signature
  const r = signature.slice(0, 66);
  const s = "0x" + signature.slice(66, 130);
  const v = parseInt(signature.slice(130, 132), 16);
  console.log({ r, s, v });
  return { r, s, v, hashedMessage };
}