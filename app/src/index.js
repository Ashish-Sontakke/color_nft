import Web3 from "web3";

import ColorNFTArtifact from "../../build/contracts/ColorNFT.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ColorNFTArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        ColorNFTArtifact.abi,
        deployedNetwork.address,
      );
      console.log(this.meta);
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

    } catch (error) {
      console.error(`Could not connect to contract or chain. ${error}`);
    }
  },

  createNFT: async function () {
    console.log(`create nft function called`);
    const { mint } = this.meta.methods;
    const tokenId = document.getElementById("tokenId").value;
    const color = document.getElementById("color_code").value;

    console.log(`create nft function called with values ${tokenId} as id and ${color} as token`);
    // if (isHexColor(color)) {
      await mint(color, tokenId).send({ from: this.account });
      console.log('token minted');
    // }
  },

  getInFo: async function () {
    const { getTokenInfo } = this.meta.methods;
    const tokenId = document.getElementById("get_info_from_id").value;
    var color_info = await getTokenInfo(tokenId).call();
    console.log(`get token info: ${color_info}`);
    this.setStatus(color_info);
  },

  buyColorNFT: async function () { },

  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});



// function isHexColor(hex) {
//   return typeof hex === 'string'
//     && hex.length === 6
//     && !isNaN(Number('0x' + hex))
// }