var json = [
    {   
        "question":    "Hvor skal applikasjonen kjøres?",
        "answers": [
            {
                "answer": "Web (intranett/internett)",
                "bulletpoints": [
                    {
                        "t": "Utvikling",
                        "p": [
                            "Husk HTTPS! <a href=\"https://scotthelme.co.uk/https-deployment-tips/\" target=\"_blank\">More</a>", 
                            "Husk logging, men vær obs på hva du logger! <a href=\"https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html\" target=\"_blank\">More</a> "
                        ]
                    }
                ],
                "question": "Hvordan skal den hostes?",
                "answers": [
                    {
                        "answer": "Sky",
                        "bulletpoints": [
                            {
                                "t": "Utvikling",
                                "p": [
                                    "Si noe lurt om skyhosting her!",
                                    "Si noe annet lurt om skyhosting"
                                ]
                            }, 
                            {
                                "t": "Testing",
                                "p": [
                                    "Si noe lurt om testing og skyen her!"
                                ]
                            },
                            {
                                "t": "Personvern",
                                "p": [
                                    "Her må vi ha noe lurt om personvern og skyer. Kjipt om skyen lekker..."
                                ]
                            }
                        ]
                    }, 
                    {
                        "answer": "Hos kunde",
                        "bulletpoints": [
                            {
                                "t": "Drift/Forvaltning",
                                "p": [
                                    "Er det avklart hvem som er ansvarlig for sikkerhetshendelser?",
                                    "Er rutinene avklart mtp oppdatering av bibliotek/dependencies/OS?"
                                ]
                            }, 
                            {
                                "t": "Testing",
                                "p": [
                                    "Er det avklart hvem som er ansvarlig for test og deployment?"
                                ]
                            }
                            
                        ]
                    }, 
                    {
                        "answer": "Hos tredjepart",
                        "bulletpoints": [
                            {
                                "t": "Drift/Forvaltning",
                                "p": [
                                    "Er det avklart hvem som er ansvarlig for sikkerhetshendelser?",
                                    "Er rutinene avklart mtp oppdatering av bibliotek/dependencies/OS?"
                                ]
                            }, 
                            {
                                "t": "Testing",
                                "p": [
                                    "Er det avklart hvem som er ansvarlig for test og deployment?"
                                ]
                            },
                            {
                                "t": "Personvern",
                                "p": [
                                    "Har tredjepart databehandleravtale?"
                                ]
                            }
                        ]
					}
				]
            }, 
            {
                "answer": "Lokalt på en EDB-maskin",
                "bulletpoints": [
                    {
                        "t": "Utvikling",
                        "p": ["Er ansvar for sikkerhetstesting og deployment avklart med kunde?"]
                    }
                ]
            }
        ]
    },
    {   
        "question":    "Benytter prosjektet tredjepartsbibilotek?",
        "answers": [
            {
                "answer": "Ja",
                "bulletpoints": [
                    {
                        "t": "Utvikling",
                        "p": ["Risikovurder tredjepartsbibliotek og kilder for disse!"]
                    }
                ]
            },
            {
                "answer": "Nei",
                "bulletpoints": [
                    {
                        "t": "Utvikling",
                        "p": ["Ved å bruke tredjepartsbibliotek introduserer du potensielle sårbarheter som skaper jobbsikkerhet. Prøv igjen!"]
                    }
                ]
            }
        ]
    }
];

var globId = 1;

var availableBulletPoints = [];

var checklist = {}

function getNextId(){
    return globId++;
}

function getAnswers(jsObj){
    var liNode = document.createElement("li");
    var answerId = getNextId();
    
    liNode.innerHTML = '<input class="clcheck" data-id="' + answerId + '" type="checkbox" name="qid_' + answerId + '" /><label for="qid_' + answerId + '">' + jsObj.answer + '</label>';
    
    /*var liText = document.createTextNode(jsObj.answer);
    liNode.appendChild(liText);*/

    if ("bulletpoints" in jsObj){
        registerBulletpoint(answerId, jsObj.bulletpoints);
    }

    var subOl = document.createElement("ol");
    var subOlWasSet = false;

    // ett spm har 1+ svar under, hvert svar kan ha nye spm:
    if ('question' in jsObj){
        subOlWasSet = true;
        var sub = getQuestions(jsObj);
        subOl.appendChild(sub);
    }

    if (subOlWasSet){
        liNode.appendChild(subOl);
    }

    return liNode;
}


function getBulletPointByOwnerId(ownerId){
    var bullets = [];
    for(var i =0; i<availableBulletPoints.length; i++){
        if (availableBulletPoints[i].ownerId == ownerId){
            bullets.push(availableBulletPoints[i]);
        }
    }

    return bullets;
}

// Lag et register med alle bulletpoints organisert etter header
function registerBulletpoint(ownerId, bpoints){
    for(var i=0; i<bpoints.length; i++){
        for(var j=0; j<bpoints[i].p.length; j++){
            availableBulletPoints.push({"ownerId": ownerId, "topic": bpoints[i].t, "point":  bpoints[i].p[j]});
        }
    }
}

// hent alle spm fra et jssonobjekt. Sjekker også for childspm nestet inni.
function getQuestions(jsObj){
    var liNode = document.createElement("li");
    var qId = getNextId();
    liNode.dataset.id= qId;

    
    var liText = document.createTextNode(jsObj.question);
    liNode.appendChild(liText);
    
    var subOl = document.createElement("ol");
    var subOlWasSet = false;

    // ett spm har 1+ svar under, hvert svar kan ha nye spm:

    if ('answers' in jsObj){
        for (var j =0; j<jsObj.answers.length; j++){

            if ('answer' in jsObj.answers[j]){
                subOlWasSet = true;
                var sub = getAnswers(jsObj.answers[j]);
                subOl.appendChild(sub);
            }
        }

        if (subOlWasSet){
            liNode.appendChild(subOl);
        }
    }
    return liNode;
}

function init(){
    var l = document.querySelector('#checklist');

	for(var i=0; i<json.length; i++){
		l.appendChild(getQuestions(json[i]));
    }
    
}

function addToChecklist(bullets){
    for(var i=0; i<bullets.length; i++){
        // {"ownerId": ownerId, "topic": bpoints[i].t, "point":  bpoints[i].p[j]}
        //console.log(bullets[i]);


        if (!(bullets[i].topic in checklist)){
            checklist[bullets[i].topic] = [];
        }

        checklist[bullets[i].topic].push(bullets[i].point);
    }
}

function printChecklist(){
    var container = document.querySelector('div#checklist');
    container.innerHTML = '';

    
    
    for (const [key, value] of Object.entries(checklist)) { 
        var subContainer = document.createElement("div");
        console.log(key);
        subContainer.innerHTML = "<h1>" + key + "</h1>";

        var lst = document.createElement("ul");

        for(var i=0; i<value.length; i++){
            var lstEntry = document.createElement("li");
            lstEntry.innerHTML = value[i];
            lst.append(lstEntry);
        }

        subContainer.append(lst);
        container.append(subContainer);
    }

}

// Jeg er lat, finnes sikkert enklere måter å gjøre dette på uten jquery... 
$(document).ready(function(){
    $('input[type=checkbox]').on('change', function(){
        checklist = {}

        var checked = $('input:checkbox:checked');

        for(var i=0; i<checked.length; i++){
            var ownerId = checked[i].dataset.id;
            var bullets = getBulletPointByOwnerId(ownerId);
            addToChecklist(bullets);
        }

        printChecklist();
    });
});