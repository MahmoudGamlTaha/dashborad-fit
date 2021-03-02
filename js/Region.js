
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;

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

    let region = getUrlParameter('r');
    let entityName = getUrlParameter('eN');
    let overAll = getUrlParameter('num');
    let eNnum = getUrlParameter('enum');
    let ename = getUrlParameter('ename');

    $("#en-name").html(ename);
    $("#en-num").html(eNnum);

    let pageEntity = {
         "DistanceDrivenRegionWise":{"DistanceDrivenRegionSiteWise": ["Region", "Site", "Distance"]},
         "DrivingDurationRegionWise":{"DrivingDurationRegionSiteWise": ["Region", "Site", "DrivingDuration"]},
        "TripsCountRegionWise":{"TripsCountRegionSiteWise":["Region", "Site", "Trips"]},
        "OverspeedCountRegionWise":{"OverspeedCountRegionSiteWise":["Region", "Site", "Occurrences"]},
        "ViolationsCountRegionWise":{"ViolationsCountRegionSiteWise":["Region", "Site", "Occurrences"]},
        "RestViolationRegionWise":{"RestViolationRegionSiteWise":["Region", "Site", "Occurrences"]},
        "PowerFailureRegionWise":{"PowerFailureRegionSiteWise":["Region", "Site", "Occurrences"]}
    };

    if(pageEntity[entityName]) {
        let values = pageEntity[entityName];
        $.each(values, function (k, v) {

            let r = v[0];
            let s = v[1];
            let d = v[2];

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
                        r,
                        s,
                        d
                    ],
                    Filter: [
                        {
                            "Display": "Region",
                            "Predicate": "LIKE '%"+ region +"%'"
                        }
                    ],
                    Parameter: [
                        {
                            "Input": "@StartDate",
                            "Default": "'01-01-2021'",
                            "Type": "date"
                        },
                        {
                            "Input": "@EndDate",
                            "Default": "'" + today + "'",
                            "Type": "date"
                        }
                    ],
                    OrderBy: [],
                    TopClause: 0
                },
                success: function (data) {
                    let r = data['result'];
                    let totalPCE = 0;
                    let totalCFI = 0;
                    $(".regionName").append("<h5 class=\"text-uppercase primary-heading__inner\">"+region+"</h5>\n" +
                        "                            <div class=\"counter__num\">"+overAll+"</div>");

                    for(let i=0;i<r.length;i++)
                    {
                        if(r[i]['Site'].includes("CFI"))
                        {
                            totalPCE += r[i][d];
                            let html = "<li class=\"col-lg-4 mb-3\">\n" +
                                "                                <div class=\"str__col--box bg__blue--sky d-flex flex-column justify-content-betwen\">\n" +
                                "                                    <h5 class=\"box__text box__text-inner\">"+r[i][s]+"</h5>\n" +
                                "                                    <div class=\"counter__num text-white\">"+r[i][d]+"</div>\n" +
                                "                                </div>\n" +
                                "                            </li>";
                            $('#cfiList').append(html);
                            $("#CFI").html(totalPCE);
                        }

                        if(r[i]['Site'].includes("PCE"))
                        {
                            totalCFI += r[i][d];
                            let html = "<li class=\"col-lg-4 mb-3\">\n" +
                                "                                <div class=\"str__col--box bg__blue d-flex flex-column justify-content-betwen\">\n" +
                                "                                    <h5 class=\"box__text box__text-inner\">"+r[i][s]+"</h5>\n" +
                                "                                    <div class=\"counter__num text-white\">"+r[i][d]+"</div>\n" +
                                "                                </div>\n" +
                                "                            </li>";
                            $('#pceList').append(html);
                            $("#PCE").html(totalCFI);
                        }
                    }
                }
            });
        });
    }