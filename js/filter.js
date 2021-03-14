
    today = moment().format('MM-DD-YYYY');
    startDate = today;
    endDate = today+' 23:59:59';
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

    let r = getUrlParameter('r');
    let s = getUrlParameter('s');
    let preDate = getUrlParameter('preDate');
    let fDate = getUrlParameter('fdate');
    let tDate = getUrlParameter('tdate');

    if(r != 0) {
        $(".regionName").append("<h5 class=\"text-uppercase primary-heading__inner\">Region:  " + r + "</h5>\n");
    }else
    {
        r = ' ';
    }
    if(s != 0)
    {
        $(".regionName").append("<h5 class=\"text-uppercase primary-heading__inner\">Site:  " + s + "</h5>\n");
    }else
    {
        s = ' ';
    }
    if(preDate != 0)
    {
        $(".regionName").append("<h5 class=\"text-uppercase primary-heading__inner\">Date:  " + preDate + "</h5>\n");

        ysterday = moment().subtract(1, 'days').format('MM-DD-YYYY');
        //console.log(ysterday);
        if(preDate == 'today')
        {
            startDate = today;
            endDate = today+' 23:59:59';
        }else if(preDate == 'yesterday' || preDate == 'lhours')
        {
            startDate = ysterday;
            endDate = ysterday+' 23:59:59';
        }else if(preDate == 'lweek')
        {
            startDate = moment().subtract('days', 7).format('MM-DD-YYYY');
        }else if(preDate == 'lmonth')
        {
            startDate = moment().subtract(1, 'months').format('MM-DD-YYYY');
        }else if(preDate == 'lyear')
        {
            startDate = moment().subtract(1, 'years').format('MM-DD-YYYY');
        }

    }else {
        preDate = ' ';
    }

    if(fDate != '' && tDate != '' && preDate == 0)
    {
        startDate = fDate;
        endDate = tDate+' 23:59:59';
    }
    $(".regionName").append("<h5 class=\"text-uppercase primary-heading__inner\">Start Date :  " + startDate + "</h5>\n");
    $(".regionName").append("<h5 class=\"text-uppercase primary-heading__inner\">End Date :  " + endDate + "</h5>\n");


    let pageEntity = {
        "DistanceDrivenRegionSiteWise": ["Region", "Site", "Distance"],
        "DrivingDurationRegionSiteWise": ["Region", "Site", "DrivingDuration"],
        "TripsCountRegionSiteWise":["Region", "Site", "Trips"],
        "OverspeedCountRegionSiteWise":["Region", "Site", "Occurrences"],
        "ViolationsCountRegionSiteWise":["Region", "Site", "Occurrences"],
        "RestViolationRegionSiteWise":["Region", "Site", "Occurrences"],
        "PowerFailureRegionSiteWise":["Region", "Site", "Occurrences"]
    };

    function c() {
        $.each(pageEntity, function (k, v) {

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
                        v[1],
                        v[2]
                    ],
                    Filter: [
                        {
                            "Display": "Region",
                            "Predicate": "LIKE '%" + r + "%'"
                        },
                        {
                            "Display": "Site",
                            "Predicate": "LIKE '%" + s + "%'"
                        }
                    ],
                    Parameter: [
                        {
                            "Input": "@StartDate",
                            "Default": "'" + startDate + "'",
                            "Type": "date"
                        },
                        {
                            "Input": "@EndDate",
                            "Default": "'" + endDate + "'",
                            "Type": "date"
                        }
                    ],
                    OrderBy: [],
                    TopClause: 0
                },
                success: function (data) {
                    let r = data['result'];
                    let overAll = 0;
                    for (let i = 0; i < r.length; i++) {
                        overAll += r[i][v[2]];
                    }
                    $("#" + v[2]).html(overAll);
                    if (k == 'OverspeedCountRegionSiteWise') {
                        $("#overSpeed").html(overAll);
                    }
                    if (k == 'ViolationsCountRegionSiteWise') {
                        $("#eventViolation").html(overAll);
                    }
                    if (k == 'RestViolationRegionSiteWise') {
                        $("#restViolations").html(overAll);
                    }
                    if (k == 'PowerFailureRegionSiteWise') {
                        $("#powerFailure").html(overAll);
                    }
                }
            });
        });
    }
    (function p() {
        c();
        setTimeout(p, 60000);
    })();
