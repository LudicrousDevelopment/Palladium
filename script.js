let comopen = false
let setopen = false
let cloud  = true
let dark = false
let scifi = false
let galaxy = false
function changeFavicon(text) {
  const canvas = document.createElement('canvas');
  canvas.height = 64;
  canvas.width = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = '64px serif';
  ctx.fillText(text, 0, 64);

  const link = document.createElement('link');
  const oldLinks = document.querySelectorAll('link[rel="shortcut icon"]');
  oldLinks.forEach(e => e.parentNode.removeChild(e));
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.href = canvas.toDataURL();
  document.head.appendChild(link);
}
changeFavicon('☁️');
function check()
{
  
}
function clear()
{
  document.getElementById("sub").style.height = "100px"; //make its size normal
  document.getElementById("discord2").style.marginLeft = "300%"; //make it disappear
  document.getElementById("discord1").style.marginLeft = "300%"; //make it disappear
  document.getElementById("darkmode").style.marginLeft = "300%"; //make it disappear
  document.getElementById("scifimode").style.marginLeft = "300%"; //make it disappear
  document.getElementById("galaxymode").style.marginLeft = "300%";
  document.getElementById("cloudmode").style.marginLeft = "300%";
}



function comm()
{
  if(comopen == false)
  {
    comopen = true
    clear();
    document.getElementById("sub").style.height = "200px";
    document.getElementById("discord2").style.marginLeft = "0px";
    document.getElementById("discord1").style.marginLeft = "0px";
  }else{
    
    comopen = false;
    clear();
  }
  
} 
//https://discord.gg/unblock --TN(Titanium Network) invite link
//https://discord.gg/nuQN7GZUfH  --SN(Sky Network) invite link
 

function titanium()
{
   window.open( "https://discord.gg/unblock", "_blank");
}
function skynet()
{
   window.open( "https://discord.gg/nuQN7GZUfH", "_blank");
}

function settings()
{     if (setopen == false){
        clear();
        document.getElementById("sub").style.height = "100px";
        document.getElementById("darkmode").style.marginLeft = "0px";
        document.getElementById("scifimode").style.marginLeft = "0px";
        document.getElementById("galaxymode").style.marginLeft = "0px";
        document.getElementById("cloudmode").style.marginLeft = "0px";
        setopen = true;
      }else{

        setopen = false;
        clear();
      }


}
function CloudMode() {
  if(cloud == false)
  {
    document.getElementById("cloudmode").style.borderColor = "#fff"
    document.getElementById("cloudmode").style.borderWidth = "2px" 
    if(dark == false)
    {
      if(dark == false)
      {
        if(dark == false)
        {
      
        }
      }
    }
    
    cloud = true;
  }else{
    
    document.getElementById("cloudmode").style.borderColor = "#99ff99"
    document.getElementById("cloudmode").style.borderWidth = "4px"
    cloud = false;
  }
}



function credits()
{
  
}

function cloaktab()
{
  document.title = "MyBib ";

  changeFavicon('📚');
}
function DarkMode() {
  if(dark == false)
  {
    
    document.getElementById("darkmode").style.borderColor = "#99ff99"
    document.getElementById("darkmode").style.borderWidth = "4px"
    dark = true;
  }else{
    document.getElementById("darkmode").style.borderColor = "#fff"
    document.getElementById("darkmode").style.borderWidth = "2px"
    dark = false;
  }
  
    var element1 = document.body;
    element1.classList.toggle("dark-mode");
    var element2 = document.getElementById("sub");
    element2.classList.toggle("dark-mode2");
    var element3 = document.getElementById("main");
    element3.classList.toggle("dark-mode1");
    var element3 = document.getElementById("url-input");
    element3.classList.toggle("dark-mode3");
  
  
}
function ScifiMode() {
  if(scifi == false)
  {
    
    document.getElementById("scifimode").style.borderColor = "#99ff99"
    document.getElementById("scifimode").style.borderWidth = "4px"
    scifi = true;
  }else{
    document.getElementById("scifimode").style.borderColor = "#fff"
    document.getElementById("scifimode").style.borderWidth = "2px"
    scifi = false;
  }
  
    var element1 = document.body;
    element1.classList.toggle("scifi-mode");
    var element2 = document.getElementById("sub");
    element2.classList.toggle("scifi-mode2");
    var element3 = document.getElementById("main");
    element3.classList.toggle("scifi-mode1");
}

function GalaxyMode() {
  if(galaxy == false)
  {
    
    document.getElementById("galaxymode").style.borderColor = "#99ff99"
    document.getElementById("galaxymode").style.borderWidth = "4px"
    galaxy = true;
  }else{
    document.getElementById("galaxymode").style.borderColor = "#fff"
    document.getElementById("galaxymode").style.borderWidth = "2px"
    galaxy = false;
  } 
    var element1 = document.body;
    element1.classList.toggle("galaxy-mode");
    var element2 = document.getElementById("sub");
    element2.classList.toggle("galaxy-mode2");
    var element3 = document.getElementById("main");
    element3.classList.toggle("galaxy-mode1");
}

function g4mesplace()
{
  document.getElementById("sub").style.height = "350px";
}
