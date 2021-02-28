
// **************** PAGES: distance-driven.html / driven-dur.html / trip-count.html /
// ************* total-speed.html / total-event.html / rest.html / power.html

    let pageName = document.location.pathname.match(/[^\/]+$/)[0];

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;

    let pageEntityOverall = [{
        "distance-driven.html": {'DistanceDrivenOverall' : 'Distance'},
        "driven-dur.html":      {'DrivingDurationOverall' : 'DrivingDuration'},
        "trip-count.html":      {'TripsCountOverall' : 'Trips'},
        "total-speed.html":     {'OverspeedCountOverall' : 'Occurrences'},
        "total-event.html":     {'ViolationsCountOverall' : 'Occurrences'},
        "rest.html":            {'RestViolationOverall' : 'Occurrences'},
        "power.html":           {'PowerFailureOverall' : 'Occurrences'}
    }];
    $.each(pageEntityOverall, function (k, v) {
        if (v[pageName]) {
            $.each(v[pageName], function (k, v) {

                function mainCount() {
                    $.ajax({
                        url: "https://gentle-sands-79502.herokuapp.com/https://egypt.fms-tech.com/FMSAPIEgypt/api/getdata/getResult",
                        method: "POST",
                        dataType: "json",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', 'Bearer SklZTubT2Eidb0Y8VHPlQJBiFLm5mabP');
                        },
                        data: {
                            EntityName: k,
                            Fields: v,
                            Filter: [],
                            Parameter: [
                                {
                                    "Input": "@StartDate",
                                    "Default": "'01-01-2021'",
                                    "Type": "date"
                                },
                                {
                                    "Input": "@EndDate",
                                    "Default": "'"+today+"'",
                                    "Type": "date"
                                }
                            ],
                            OrderBy: [],
                            TopClause: 0
                        },
                        success: function (data) {
                            let test = data.result[0][v];
                            $("#" + v).html(test);
                            if (k == 'OverspeedCountOverall') {
                                let overSpeed = data.result[0]['Occ'];
                                $("#overSpeed").html(overSpeed);
                            }
                            if (k == 'ViolationsCountOverall') {
                                let eventViolation = data.result[0]['Occ'];
                                $("#eventViolation").html(eventViolation);
                            }
                            if (k == 'RestViolationOverall') {
                                let restViolations = data.result[0]['RestViolations'];
                                $("#restViolations").html(restViolations);
                            }
                            if (k == 'PowerFailureOverall') {
                                let powerFailure = data.result[0]['Occ'];
                                $("#powerFailure").html(powerFailure);
                            }
                        }
                    });
                };
                mainCount();
            });
        }
    });

    let pageEntity = [{
        "distance-driven.html": {"DistanceDrivenRegionWise": ["Region", "Distance", 1]},
        "driven-dur.html": {"DrivingDurationRegionWise": ["Region", "DrivingDuration", 2]},
        "trip-count.html":{"TripsCountRegionWise":["Region", "Trips", 3]},
        "total-speed.html":{"OverspeedCountRegionWise":["Region", "Occurrences", 3]},
        "total-event.html":{"ViolationsCountRegionWise":["Region", "Occurrences", 3]},
        "rest.html":{"RestViolationRegionWise":["Region", "Occurrences", 3]},
        "power.html":{"PowerFailureRegionWise":["Region", "Occurrences", 3]}
    }];

    $.each(pageEntity, function (k, v){
        if(v[pageName])
        {

            $.each(v[pageName], function (k, v){
                console.log(123);
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
                                "Default": "'01-01-2021'",
                                "Type": "date"
                            },
                            {
                                "Input": "@EndDate",
                                "Default": "'"+today+"'",
                                "Type": "date"
                            }
                        ],
                        OrderBy: [],
                        TopClause: 0
                    },
                    success: function (data) {
                        console.log(k);
                        console.log(data['result']);
                        console.log(v[0]);
                        console.log(v[1]);
                        let r = data['result'];
                        for (let i = 0; i < r.length; i++) {
                            let href = r[i][v[0]].replace(/ /g, '').toLowerCase()+"-"+v[2]+".html";
                            let html = "<li>\n" +
                                "                                <a href=\""+ href +"\">\n" +
                                "                                    <div class=\"str__col--box d-flex flex-column justify-content-between align-items-center\">\n" +
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