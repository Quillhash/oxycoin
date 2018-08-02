const oxycoin = artifacts.require('OxyCoin.sol');
// const Web3 = require('web3');
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

contract('OxyCoin', async (accounts) => {
  it('Should correctly initialize constructor values', async () => {
      let instance = await oxycoin.deployed();
      let owner = await instance.owner.call();
      let ownerBalance = await instance.balanceOf(owner);
      let totalSupply = await instance.totalSupply.call();
      assert.equal(totalSupply,125000000000000000000000000);
      assert.equal(ownerBalance,125000000000000000000000000);
      assert.equal(owner, accounts[0]); // assuming first address is used to deploy
  });

  it("should transfer right token", function() {
    var token;
    return oxycoin.deployed().then(function(instance){
      token = instance;
      return token.transfer(accounts[1], 500000000000000000000000);
    }).then(function(){
      return token.balanceOf.call(accounts[1]);
    }).then(function(result){
      assert.equal(result.toNumber(), 500000000000000000000000, 'accounts[0] balance is wrong');
      return token.balanceOf.call(accounts[0]);
    }).then(function(result){
      assert.equal(result.toNumber(),124500000000000000000000000, 'accounts[1] balance is wrong');
    })
  });

// this test case is failing .
// Need to set require statement to check that tokens must be greator then zero else it will lead to wastage of gas.

  it("should revert if someone if user tries to transfer zero token", function() {
    var token;
    return oxycoin.deployed().then(function(instance){
      token = instance;
      return token.transfer(accounts[1], 0);
    }).then(assert.fail)
    .catch((error)=>{
      assert.equal(error.message,'VM Exception while processing transaction: revert');
    });

  });

  it("should revert if someone if user tries to transfer negative tokens", function() {
    var token;
    return oxycoin.deployed().then(function(instance){
      token = instance;
      return token.transfer(accounts[1], -10000000000000000000000);
    }).then(assert.fail)
    .catch((error)=>{
      assert.equal(error.message,'VM Exception while processing transaction: revert');
      return token.balanceOf(accounts[0])
    }).then((balanceOwner)=>{
       assert.equal(balanceOwner.toNumber(),124500000000000000000000000,"owner balance is wrong");
    });

  });

  it("should give accounts[3] authority to spend account[0]'s token", function() {
    var token;
    return oxycoin.deployed().then(function(instance){
     token = instance;
     return token.approve(accounts[3], 200000000000000000000000);
    }).then(function(){
     return token.allowance.call(accounts[0], accounts[3]);
    }).then(function(result){
     assert.equal(result.toNumber(), 200000000000000000000000, 'allowance is wrong');
     return token.transferFrom(accounts[0], accounts[2], 200000000000000000000000, {from: accounts[3]});
    }).then(function(){
     return token.balanceOf.call(accounts[0]);
    }).then(function(result){
     assert.equal(result.toNumber(),124500000000000000000000000 - 200000000000000000000000 , 'accounts[0] balance is wrong');
     return token.allowance.call(accounts[0],accounts[3]);
    }).then(function(result){
     assert.equal(result.toNumber(), 0, 'accounts[1] balance is wrong');
     return token.balanceOf.call(accounts[2]);
    }).then(function(result){
     assert.equal(result.toNumber(), 200000000000000000000000, 'accounts[2] balance is wrong');
    })
  });

it("should be able to burn tokens",()=>{
  var token;
  return oxycoin.deployed().then(function(instance){
   token = instance;
   return token.burn(20000000000000000000);
  })
  .then(()=>{
    return token.totalSupply.call();
  })
  .then((supply)=>{
console.log(supply);
  })
})

it("should not be able to burn tokens",()=>{
  var token;
  return oxycoin.deployed().then(function(instance){
   token = instance;
   return token.burn(-10);
  })
  .then(assert.fail)
  .catch((error)=>{
    assert.equal(error.message,'VM Exception while processing transaction: revert');
  });

});

it("should give accounts[3] authority to burn account[0]'s token", function() {
  var token;
  return oxycoin.deployed().then(function(instance){
   token = instance;
   return token.approve(accounts[3], 200000000000000000000000);
  }).then(function(){
   return token.allowance.call(accounts[0], accounts[3]);
  }).then(function(result){
   assert.equal(result.toNumber(), 200000000000000000000000, 'allowance is wrong');
   return token.burnFrom(accounts[0], 200000000000000000000000, {from: accounts[3]});
  }).then(function(){
   return token.allowance.call(accounts[0],accounts[3]);
  }).then(function(result){
   assert.equal(result.toNumber(), 0, 'accounts[1] balance is wrong');
   return token.totalSupply.call();
  }).then(function(result){
   console.log(result.toNumber());
   

   assert.equal(1.2479998e+26,result.toNumber(),"total supply is wrong" );
  })
});

it("should be able to mint  tokens", function() {
  var token;
  return oxycoin.deployed().then(function(instance){
   token = instance;
   return token.mintToken(accounts[3], 200000000000000000000000);
  })
  .then(()=>{
    return token.balanceOf(accounts[3]);
  })
  .then(function(result){
   assert.equal(result.toNumber(),200000000000000000000000, 'accounts[3] balance is wrong');
   return token.totalSupply.call();
  }).then(function(result){
   console.log(result.toNumber());
   

  assert.equal(+1.2499998e+26,result.toNumber(),"total supply is wrong" );
  })

});

// this test case is failing ,It means if owner pass a negative value in mintToken function it can lead to bad things.

it("should not be able to mint negative  tokens", function() {
  var token;
  return oxycoin.deployed().then(function(instance){
   token = instance;
   return token.mintToken(accounts[3], -200000000000000000000000);
  }).then(assert.fail)
  .catch((error)=>{
    assert.equal(error.message,'VM Exception while processing transaction: revert');
  });
});

it("should not be able to transfer tokens when paused", function() {
  var token;
  return oxycoin.deployed().then(function(instance){
   token = instance;
   return token.pause();
  
  }).then(()=>{
    return token.transfer(accounts[3], 200000000000000000000000);
  })
  .then(assert.fail)
  .catch((error)=>{
    assert.equal(error.message,'VM Exception while processing transaction: revert');
  })
  
});
it("should be able to unpause and transfer tokens", function() {
  var token;
  return oxycoin.deployed().then(function(instance){
   token = instance;
   return token.unpause();
  
  }).then(()=>{
    return token.transfer(accounts[8], 200000000000000000000000);
  })
  .then(()=>{
    return token.balanceOf(accounts[8])
    
  })
  .then((result)=>{
    assert.equal(result,200000000000000000000000,"account 8 balance is wrong");
    
  })
  
});
});





