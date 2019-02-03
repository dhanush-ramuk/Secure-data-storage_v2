
App = {
  web3provider : null,
  contracts : {},
  account : '0x0',
  contractInstance: null, 
  name: [],
  id: [], 
  text: [],
  title: [],
  k: 0,
  m: 0,
    init: async()=>{
    await App.initweb3();
    await App.initcontract();
    await App.render();
    await App.get();
    return App.get_text();
  },
  initweb3: async() =>{
    if(typeof web3 !== 'undefined'){
      App.web3provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider);
    }
    else{
      window.alert('please install the fucking metamask and not the beta.')
    }
    if(window.ethereum){
      window.web3 = new Web3(ethereum);
      try{
        await ethereum.enable();
      } catch(error){

      }
    }
    else if(window.web3){
      window.web3 = new Web3(web3.currentProvider);
    }
    else {
      console.log("You don't have Metamask right?");
    }
  },

  initcontract: async() =>{
    var contract = await $.getJSON('Main.json');
    App.contracts.Mycontract = TruffleContract(contract);
    App.contracts.Mycontract.setProvider(App.web3provider);
  },

  render: async() =>{
    App.account = web3.eth.accounts[0];
    var login = $('#login');
    var signup = $('#signup');
    var main = $("#main");

    const contract = await App.contracts.Mycontract.deployed();
    App.contractInstance = contract;
    const result = await App.contractInstance.check({from: App.account}); 
  $(" #account_address").html(App.account);    
    if(result==true){
      
      signup.hide();
      login.show();
    $("#main").show();

    }else{
      
      login.hide();
      signup.show();

    $("#main").show();
    }

  },

  login: async() =>{
    const id = $('#passw').val();
    const result = await App.contractInstance.login({from: App.account});
    if(result==id){
       window.location = 'z.html';
       $("#password_manager").show();
    }
  },
  signup: async() =>{
    const id = $("#pass").val();
    const id1 = $("#pass1").val();
    if(id == id1){
     await App.contractInstance.signup(id, {from: App.account});
        window.location = 'z.html'; 
        $("#password_manager").show();
    } 
  },
  show_password: async() =>{
    $("#password_manager").show();
    $("#notepad").hide();
  },
    show_notepad: async() =>{
    $("#password_manager").hide();
    $("#notepad").show();
  },


  set: async() =>{
    const name = $('#a_name').val();
    const id = $('#a_id').val();
    await App.contractInstance.add_id(name, id , {from: App.account});
    return App.get();
   
  },
  get: async() =>{
    var i = 0;
        App.k = await App.contractInstance.get_length({from: App.account});
        if(App.k>0){
            App.name[0] = await App.contractInstance.get_accountname(0, {from: App.account});
     App.id[0] = await App.contractInstance.get_password(0, {from: App.account});
    var table = "<tr><td style:'margin-top:500px'>"+App.name[0]+"</td><td><input type='password' value="+App.id[0]+" id="+i+"></input></td><td><input type='submit' id='"+i+"fh' value='reveal/hide' onclick='App.reveal("+i+"); return false;'></input></td></tr>";
    for ( i = 1; i<App.k; i++) {
     App.name[i] = await App.contractInstance.get_accountname(i, {from: App.account});
     App.id[i] = await App.contractInstance.get_password(i, {from: App.account});
    table += "<tr><td>"+App.name[i]+"</td><td><input type='password' value="+App.id[i]+" id="+i+"></input></td><td><input type='submit' value='reveal/hide' onclick='App.reveal("+i+"); return false;'></input></td></tr>";;
    }
    $('#rtable').html(table);
    }
  },

  reveal: async(el) =>{     
   var x = document.getElementById(el);      
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }  
  },

  set_notepad: async()=>{
    const a = $('#notepad_title').val();
    const b = $('#notepad_text').val();
    await App.contractInstance.add_text(a, b, {from: App.account});
    return App.get_text();
  },
  get_text: async()=>{

 var i = 0;
        App.m = await App.contractInstance.get_length_text({from: App.account});
        if(App.m>0){
            App.title[0] = await App.contractInstance.get_title(0, {from: App.account});
     App.text[0] = await App.contractInstance.get_text(0, {from: App.account});
    var table = "<tr><td>"+App.title[0]+"</td><td><input type='submit' value='reveal/hide' onclick='App.reveal_text("+i+"); return false;'></input></td></tr>";
    for ( i = 1; i<App.m; i++) {
     App.title[i] = await App.contractInstance.get_title(i, {from: App.account});
     App.text[i] = await App.contractInstance.get_text(i, {from: App.account});
    table += "<tr><td>"+App.title[i]+"</td><td><input type='submit' value='reveal/hide' onclick='App.reveal_text("+i+"); return false;'></input></td></tr>";;
    }
    $('#ttable').html(table);
    }
  },
  reveal_text: async(el) =>{
    $("#notepad_title").val(App.title[el]);
    $("#notepad_text").val(App.text[el]);
  },

}

$(window).load(() =>{
  App.init();
})
