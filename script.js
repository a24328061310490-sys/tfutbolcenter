const API_KEY = "648fc05e84c54e4ab6072da834cbbc79";

function getLiga(){
  return document.getElementById("liga").value;
}

// ⚽ EQUIPOS
function cargarEquipos(){
  fetch(`https://corsproxy.io/?https://api.football-data.org/v4/competitions/${getLiga()}/teams`,{
    headers:{ "X-Auth-Token":API_KEY }
  })
  .then(res=>res.json())
  .then(data=>{
    let html="";
    data.teams.forEach(t=>{
      html+=`
      <div class="match">
        <img src="${t.crest}" class="logo">
        ${t.name}
      </div>`;
    });
    contenido.innerHTML=html;
  });
}

// 📊 TABLA
function cargarTabla(){
  fetch(`https://corsproxy.io/?https://api.football-data.org/v4/competitions/${getLiga()}/standings`,{
    headers:{ "X-Auth-Token":API_KEY }
  })
  .then(res=>res.json())
  .then(data=>{
    let tabla=data.standings[0].table;
    let total=tabla.length;

    let html=`<table class="table">
    <tr><th>#</th><th>Equipo</th><th>Pts</th></tr>`;

    tabla.forEach((t,i)=>{
      let clase="";
      if(i<4) clase="top";
      if(i>=total-3) clase="down";

      html+=`
      <tr class="${clase}">
        <td>${t.position}</td>
        <td class="team-cell">
          <img src="${t.team.crest}" class="logo">
          ${t.team.name}
        </td>
        <td>${t.points}</td>
      </tr>`;
    });

    html+="</table>";
    contenido.innerHTML=html;
  });
}

// 🔴 PARTIDOS (sin cambios)
function cargarPartidos(){
  fetch("https://corsproxy.io/?https://api.football-data.org/v4/matches",{
    headers:{ "X-Auth-Token":API_KEY }
  })
  .then(res=>res.json())
  .then(data=>{
    let html="<h2 style='text-align:center'>⚽ Partidos</h2>";

    data.matches.slice(0,20).forEach(m=>{
      html+=`
      <div class="match">
        <img src="${m.homeTeam.crest}" class="logo">
        ${m.homeTeam.name} vs 
        <img src="${m.awayTeam.crest}" class="logo">
        ${m.awayTeam.name}
        <br>
        <strong>${m.score.fullTime.home ?? "-"} - ${m.score.fullTime.away ?? "-"}</strong>
      </div>`;
    });

    contenido.innerHTML=html;
  });
}

// 🏆 CHAMPIONS (ARREGLADO)
function cargarChampions(){

  fetch("https://corsproxy.io/?https://api.football-data.org/v4/competitions/CL/standings",{
    headers:{ "X-Auth-Token":API_KEY }
  })
  .then(res=>res.json())
  .then(data=>{

    let html="<h2 style='text-align:center'>🏆 Champions League</h2>";

    data.standings.forEach((grupo,i)=>{
      html+=`<h3 style="margin-left:20px">Grupo ${i+1}</h3>`;

      html+=`<table class="table">
      <tr><th>#</th><th>Equipo</th><th>Pts</th></tr>`;

      grupo.table.forEach(t=>{
        html+=`
        <tr>
          <td>${t.position}</td>
          <td class="team-cell">
            <img src="${t.team.crest}" class="logo">
            ${t.team.name}
          </td>
          <td>${t.points}</td>
        </tr>`;
      });

      html+="</table><br>";
    });

    return fetch("https://corsproxy.io/?https://api.football-data.org/v4/competitions/CL/matches",{
      headers:{ "X-Auth-Token":API_KEY }
    })
    .then(res=>res.json())
    .then(matches=>{

      html+="<h2 style='text-align:center'>🏆 Camino a la Final</h2>";

      matches.matches.forEach(m=>{

        let fase=m.stage;

        if(fase==="LEAGUE_STAGE") fase="Liga";
        if(fase==="LAST_16") fase="Octavos";
        if(fase==="QUARTER_FINALS") fase="Cuartos";
        if(fase==="SEMI_FINALS") fase="Semifinal";
        if(fase==="FINAL") fase="Final";

        html+=`
        <div class="champions-match">

          <div class="stage">${fase}</div>

          <!-- 🔥 ARREGLO AQUÍ -->
          <div class="match-teams" style="display:flex; align-items:center; justify-content:space-between;">

            <!-- LOCAL -->
            <div style="display:flex; align-items:center; gap:8px;">
              <img src="${m.homeTeam.crest}" class="match-logo">
              ${m.homeTeam.name}
            </div>

            <!-- MARCADOR CENTRADO -->
            <span style="width:80px; text-align:center;">
              <strong>
                ${m.score.fullTime.home ?? "-"} - ${m.score.fullTime.away ?? "-"}
              </strong>
            </span>

            <!-- VISITANTE -->
            <div style="display:flex; align-items:center; gap:8px;">
              ${m.awayTeam.name}
              <img src="${m.awayTeam.crest}" class="match-logo">
            </div>

          </div>

        </div>`;
      });

      contenido.innerHTML=html;
    });

  });
}