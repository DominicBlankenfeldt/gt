import{d as i,c as s,g as r,l as a,a as o,B as m,_ as n,b as d,e as t,t as c,f as l,h,o as g}from"./index-d4111d68.js";const p=i({data(){return{dataLoad:!1,user:s,player:{}}},async mounted(){if(this.user)try{let e=await r();e&&(this.player=e.player)}catch{a()}this.player=o(this.player,this.user),this.buttonSound(),this.dataLoad=!0},methods:{buttonSound(){m(this.player.settings.effectVolume)}}}),v=""+new URL("../img/items/coin/coin.gif",import.meta.url).href,u=""+new URL("../img/items/darkhole/darkhole.png",import.meta.url).href,_=""+new URL("../img/items/potion/potion.gif",import.meta.url).href,y=""+new URL("../img/items/bomb/bomb.gif",import.meta.url).href,w=""+new URL("../img/items/magnet/magnet.png",import.meta.url).href,f=""+new URL("../img/items/snowflake/snowflake.gif",import.meta.url).href,b=""+new URL("../img/items/clock/clock.png",import.meta.url).href,k=""+new URL("../img/char/enemy_space_debris1.gif",import.meta.url).href,L=""+new URL("../img/char/enemy_komet.gif",import.meta.url).href,U=""+new URL("../img/char/enemy_gasman.gif",import.meta.url).href,R=""+new URL("../img/char/enemy_rino_fish_spin.gif",import.meta.url).href,S=""+new URL("../img/char/enemy_blue-nebula.gif",import.meta.url).href,A=""+new URL("../img/char/enemy_satenna.gif",import.meta.url).href,B={key:0,class:"container"},$={class:"card",style:{"margin-top":"8vh"}},x=t("div",{class:"card-header"},"Movement",-1),V={class:"card-body"},N=h('<div class="card mt-1"><div class="card-header">Items</div><div class="card-body"><div><img src="'+v+'" alt=""> A coin gives you score if you collect it </div><div><img src="'+u+'" alt=""> A darkhole sucks in everything nearby </div><div><img src="'+_+'" alt=""> A growpotion makes you and enemies bigger if you are grown you get more score </div><div><img src="'+y+'" alt=""> A bomb resets all enemies </div><div><img src="'+w+'" alt=""> A magnet lets you attract items and repel enemies or enemies attract you </div><div><img src="'+f+'" alt=""> Slow all enemies </div><div><img src="'+b+'" alt=""> Stops the time </div></div></div><div class="card mt-1"><div class="card-header">Enemies</div><div class="card-body"><div class="row justify-content-center"><div style="height:3vw;width:3vw;"><img src="'+k+'" alt="" height="35px"></div><div style="height:3vw;width:3vw;"><img src="'+L+'" alt="" height="35px"></div><div style="height:3vw;width:3vw;"><img src="'+U+'" alt="" height="35px"></div><div style="height:3vw;width:3vw;"><img src="'+R+'" alt="" height="35px"></div><div style="height:3vw;width:3vw;"><img src="'+S+'" alt="" height="35px"></div><div style="height:3vw;width:3vw;"><img src="'+A+'" alt="" height="35px"></div></div><p class="mt-1">They will kill you. wink smiley</p></div></div>',2);function C(e,E,P,j,D,G){return e.dataLoad?(g(),d("div",B,[t("div",$,[x,t("div",V,[t("p",null,c(`You can move with "${e.player.settings.moves.up+e.player.settings.moves.left+e.player.settings.moves.down+e.player.settings.moves.right}" or with the arrow keys`),1)])]),N])):l("",!0)}const M=n(p,[["render",C]]);export{M as default};
