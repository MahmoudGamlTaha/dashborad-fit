
// **************** PAGES: distance-driven.html / driven-dur.html / trip-count.html /
// ************* total-speed.html / total-event.html / rest.html / power.html

    let pageName = document.location.pathname.match(/[^\/]+$/)[0];

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;
	endToday = today + ' 23:59:59';

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };

    let overAll = getUrlParameter('num');
    let v = getUrlParameter('v');
    let ename = $("#name-x").html();

    $('#'+v).html(overAll);


    let pageEntity = [{
        "distance-driven.html": {"DistanceDrivenRegionWise": ["Region", "Distance", 0]},
        "driven-dur.html": {"DrivingDurationRegionWise": ["Region", "DrivingDuration", 0]},
        "trip-count.html":{"TripsCountRegionWise":["Region", "Trips", 0]},
        "total-speed.html":{"OverspeedCountRegionWise":["Region", "Occurrences", 2]},
        "total-event.html":{"ViolationsCountRegionWise":["Region", "Occurrences", 3]},
        "rest.html":{"RestViolationRegionWise":["Region", "Occurrences", 1]},
        "power.html":{"PowerFailureRegionWise":["Region", "Occurrences", 0]}
    }];
    function c(){
        $.each(pageEntity, function (k, v){
            if(v[pageName])
            {
				 $("#pg-list").html("<h3>waiting...</h3>");
                $.each(v[pageName], function (k, v){
                    $.ajax({
                        url: "https://gentle-sands-79502.herokuapp.com/https://egypt.fms-tech.com/FMSAPIEgypt/api/getdata/getResult",
                        method: "POST",
                        dataType: "json",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', 'Bearer SklZTubT2Eidb0Y8VHPlQJBiFLm5mabP');
                        },
                        data: {
                            EntityName: k,
                            Fields: [
                                v[0],
                                v[1]
                            ],
                            Filter: [],
                            Parameter: [
                                {
                                    "Input": "@StartDate",
                                    "Default": "'"+today+"'",
                                    "Type": "date"
                                },
                                {
                                    "Input": "@EndDate",
                                    "Default": "'"+endToday+"'",
                                    "Type": "date"
                                }
                            ],
                            OrderBy: [],
                            TopClause: 0
                        },
                        success: function (data) {
							$("#pg-list").html("");
                            $(".appened-removal").remove();

                            let r = data['result'];
                            for (let i = 0; i < r.length; i++) {
                                let  href = "westcairo-2.html?r="+r[i][v[0]]+"&eN="+k+"&num="+r[i][v[1]]+"&enum="+r[i][v[1]]+"&ename="+ename;
                                let html = "<li class='appened-removal'>\n" +
                                    "                                <a class='appened-removal' href=\""+ href +"\">\n" +
                                    "                                    <div class=\"str__col--box d-flex flex-column justify-content-between align-items-center appened-removal\">\n" +
                                    "                                        <h5 class=\"box__text text-dark\">" + r[i][v[0]] + "</h5>\n" +
                                    "                                        <div class=\"counter__num\">" + r[i][v[1]] + "</div>\n" +
                                    "                                    </div>\n" +
                                    "                                </a>\n" +
                                    "                            </li>"
                                $("#pg-list").append(html);
                            }

                        }
                    });
                });
            }
        });
    }
    (function p() {
        c();
        setTimeout(p, 60000);
    })();