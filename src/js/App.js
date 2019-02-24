
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
  o: 0,
  hash_file: null,
  name_file: null,
  file: null,
  filehash:[],
  filename:[],
  login: 0,
  a1: null,
    init: async()=>{
    await App.initweb3();
    await App.initcontract();
    await App.render();
    await App.get();
    await App.get_text();
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
    var welcome = $("#welcome_account");
    var but = $("#start_button");

    const contract = await App.contracts.Mycontract.deployed();
    App.contractInstance = contract;
    const result = await App.contractInstance.check({from: App.account}); 
  $(" #account_address").html(App.account.substring(0,22).bold()+"...");
  welcome.html("Hi "+ App.account);    
    if(result==true){
      App.login = 1;
      but.show();
      but.html('login');  

    }else{
      but.show();
      but.html('get started');   

    }

  },
openForm: async()=>{
if(App.login==1)
{
  document.getElementById("login").style.display = "block";
}else{
  
document.getElementById("signup").style.display = "block";
}

},

open_hash: async()=>{
      const id = $("#pass").val();
       const a = web3.sha3(id);
    await App.contractInstance.signup(id, a, {from: App.account});
     
        window.location = 'z.html'; 
        $("#password_manager").show();
},
closeForm: async()=>{
  if(App.login==1)
{
  document.getElementById("login").style.display = "none";
   $("#start_button").show();


}else{
document.getElementById("signup").style.display = "none";

}

},
closeFormeh: async()=>{
  $("#reveal").hide();
  document.getElementById("login").style.display = "block";
},
closeFormh: async()=>{
  $("#hash").hide();
  document.getElementById("signup").style.display = "block";
},


reveal1: async()=>{
  $("#start_button").hide();
  document.getElementById("login").style.display = "none";
  document.getElementById("reveal").style.display = "block";

},

hash_check: async()=>{

      const result = await App.contractInstance.get_hash({from: App.account});
      
      const a = $("#hash_inputh").val();
      console.log("3");
      console.log(result,a);
      if(result==a){
        console.log("not 6");
        const pass = await App.contractInstance.login({from: App.account});
        $("#pass_line").html(pass);
        $("#sub").hide();
        $("#okay").show(); 
      }

},

mudiyala: async()=>{
  document.getElementById("login").style.display = "block";
  document.getElementById("reveal").style.display = "none";
},

  logi: async() =>{
    const id = $('#passw').val();
    const result = await App.contractInstance.login({from: App.account});
    console.log(result, id)
    if(result==id){
       window.location = 'z.html';
       $("#password_manager").show();
    }
  },
  signup: async() =>{
    const id = $("#pass").val();
    const id1 = $("#pass1").val();

    if(id != id1){
      alert("Passwords do not match.");
  


    } 
a = web3.sha3(id);
$("#hash_line").html(a);
console.log(a);
 $("#start_button").hide();
document.getElementById("signup").style.display = "none";

 document.getElementById("hash").style.display = "block";

  },
  show_password: async() =>{
    $("#password_manager").show();
    $("#notepad").hide();
    $("#files").hide();
  },
    show_notepad: async() =>{
    $("#password_manager").hide();
    $("#notepad").show();
    $("#files").hide();
  },
   show_uploader: async() =>{
    $("#password_manager").hide();
    $("#notepad").hide();
    $("#files").show();
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
    var table = "<tr><td>"+App.name[0]+"</td><td><input type='password' value="+App.id[0]+" id="+i+"></input></td><td><input type='submit' id='"+i+"fh' value='reveal/hide' onclick='App.reveal("+i+"); return false;'></input></td></tr>";
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

  get_files: async()=>{
  App.file = await document.querySelector('input[type=file]').files[0];
 var reader= new FileReader();
  App.name_file = App.file.name;
          var type = App.name_file.split('.').pop();
          console.log(type);
//if(type!="mp3"||"gif"||"docx"||"aac"||"png"||"jpeg"||"jpg"||"doc"||"JPG"){
  //alert("Currently this file type is not supported. Please convert the type and try again.")
  //return 0;
//}
  reader.onload =  function(e) {  
  var bfile = e.target.result;
   ipfs.add(bfile, async function(err, hash) {
  if (err) throw err; 
  App.hash_file = hash; 
$("#submit_button").show();

});   

}
reader.readAsBinaryString(App.file);
},

submit: async()=>{



var h = App.hash_file;
  App.name_file = App.file.name;

   await App.contractInstance.add_files(App.hash_file, App.name_file, {from: App.account});
 
   var i = 0;
        App.o = await App.contractInstance.get_length_files({from: App.account});
        console.log(App.o);
        if(App.o>0){
            App.filename[0] = await App.contractInstance.get_filename(0, {from: App.account});
    var table = "<tr><td>"+App.filename[0]+"</td><td><input type='submit' id='"+i+"fh' value='download' onclick='App.download("+i+"); return false;'></input></td></tr>";
    for ( i = 1; i<App.o; i++) {
     App.filename[i] = await App.contractInstance.get_filename(i, {from: App.account});
 
    table += "<tr><td>"+App.filename[i]+"</td><td><input type='submit' value='download' onclick='App.download("+i+"); return false;'></input></td></tr>";
    }
    $('#rr').html(table);
    }
},
  download: async(i)=>{
    var bfile = await App.contractInstance.get_filehash(i, {from: App.account});
    var filename = await App.contractInstance.get_filename(i, {from: App.account});
    
   var reader= new FileReader();
    
   var i, l, d, array;
  ipfs.cat(bfile, function(err, buffer) {
  if (err) throw err;  
  var res = buffer.toString();
  
        d = res;
        l = res.length;
        array = new Uint8Array(l);
        for (var i = 0; i < l; i++){
            array[i] = d.charCodeAt(i);
        }

        var type = filename.split('.').pop();
        console.log(type);
        if (type=="png"){
         b = new Blob([array], {type: 'image/png'});
        } else if(type=="pdf"){

         b = new Blob([array], {type: 'application/pdf'});
        }else if(type=="jpg"||type=="jpeg"){

         b = new Blob([array], {type: 'image/jpeg'});
        }else if(type=="pdf"){

         b = new Blob([array], {type: 'application/pdf'});
        }else if(type=="aac"){

         b = new Blob([array], {type: 'audio/aac'});
        }else if(type=="doc"){

         b = new Blob([array], {type: 'application/msword'});
        }else if(type=="docx"){

         b = new Blob([array], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
        }else if(type==".docx"){

         b = new Blob([array], {type: 'application/pdf'});
        }else if(type=="gif"){

         b = new Blob([array], {type: 'image/gif'});
        }else if(type=="mp3"){

         b = new Blob([array], {type: 'audio/mpeg'});
        }
        
    
        window.location.href =  URL.createObjectURL(b);
   
});   

    

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
