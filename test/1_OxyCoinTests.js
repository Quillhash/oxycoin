const oxycoin = artifacts.require('Token.sol');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

contract('OxyCoin', async (accounts) => {
  it('Should correctly initialize constructor values', async () => {
      let instance = await oxycoin.deployed();

      let owner = await instance.owner.call(accounts[0]);
      assert.equals(owner, accounts[0]); // assuming first address is used to deploy
  });

  it('Transfers the tokens between two accounts', async () => {
      let acc1 = accounts[0];
      let acc2 = accounts[1];
      let value = 1000;
    
      let instance = await oxycoin.deployed();

      let balanceAcc1 = await oxycoin.balanceOf(acc1).call(acc1); // get balances of the 
      let balanceAcc2 = await oxycoin.balanceOf(acc2).call(acc2);

      let success = await instance.transfer(acc2, value).call(acc1);
      assert.equals(success, true);

      let newBalanceAcc1 = await instance.balanceOf(acc1).call(acc1);
      let newBalanceAcc2 = await instance.balanceOf(acc2).call(acc2);

      assert.equals(balanceAcc1 - value, newBalanceAcc1);
      assert.equals(balanceAcc2 + value, newBalanceAcc2);
  });

  it('Transfers the allowance between accounts', async () => {
      let acc1 = accounts[0];
      let acc2 = accounts[1];

      let instance = await oxycoin.deployed
  });
});