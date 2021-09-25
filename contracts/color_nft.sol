// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.7;

contract ColorNFT {
    mapping(uint256 => bytes3) tokens;
    mapping(uint256 => address) owners;

    // map for sale toknes from tokenId => tokenPrice;
    mapping(uint256 => uint256) forSale;

    function mint(bytes3 colorNFT, uint256 tokenId) public {
        require(tokens[tokenId] == 0, "Token with the id already exists");
        tokens[tokenId] = colorNFT;
        owners[tokenId] = msg.sender;
    }

    function sellToken(uint256 tokenId, uint256 price) public {
        require(
            owners[tokenId] == msg.sender,
            "Only owners can send the tokens"
        );

        require(forSale[tokenId] == 0, "the token  is already for sale");
        forSale[tokenId] = price;
    }

    function buyToken(uint256 tokenId) public payable {
        uint256 tokenPrice = forSale[tokenId];
        require(tokenPrice != 0, "the token is not for sale");
        require(
            msg.value >= tokenPrice,
            "the provided amount is not sufficient"
        );
        require(
            msg.sender != owners[tokenId],
            "the message sender is already the owner of the token"
        );
        owners[tokenId] = msg.sender;
        address payable ownerAddress = payable(owners[tokenId]);
        ownerAddress.transfer(tokenPrice);
        forSale[tokenId] = 0;
        if (msg.value > tokenPrice) {
            address payable buyerAddress = payable(msg.sender);
            buyerAddress.transfer(msg.value - tokenPrice);
        }
    }

    function getTokenInfo(uint256 tokenId)
        public
        view
        returns (bytes3 colorToken)
    {
        return tokens[tokenId];
    }
}
