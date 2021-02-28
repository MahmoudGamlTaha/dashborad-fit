
//======== PAGE: DASHBOARD ===========//

let pageName = document.location.pathname.match(/[^\/]+$/)[0];

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

today = mm + '-' + dd + '-' + yyyy;

if(pageName == "dashboard.html") {

    let entities = [{
        'DistanceDrivenOverall'    :'Distance',
        'DrivingDurationOverall'   :'DrivingDuration',
        'TripsCountOverall'        :'Trips',
        'OverspeedCountOverall'    :'Occurrences',
        'ViolationsCountOverall'   :'Occurrences',
        'RestViolationOverall'     :'Occurrences',
        'PowerFailureOverall'      :'Occurrences'
    }];

    function fn() {
        $.each(entities[0], function (k, v) {
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
                    $("#"+v).html(test);
                    if(k == 'OverspeedCountOverall') {
                        let overSpeed = data.result[0]['Occ'];
                        $("#overSpeed").html(overSpeed);
                    }
                    if(k == 'ViolationsCountOverall') {
                        let eventViolation = data.result[0]['Occ'];
                        $("#eventViolation").html(eventViolation);
                    }
                    if(k == 'RestViolationOverall') {
                        let restViolations = data.result[0]['RestViolations'];
                        $("#restViolations").html(restViolations);
                    }
                    if(k == 'PowerFailureOverall') {
                        let powerFailure = data.result[0]['Occ'];
                        $("#powerFailure").html(powerFailure);
                    }
                }
            });
        });
    };



    function vehicleStatus() {
        $.ajax({
            url: "https://gentle-sands-79502.herokuapp.com/https://egypt.fms-tech.com/FMSAPIEgypt/api/getdata/getResult",
            method: "POST",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer SklZTubT2Eidb0Y8VHPlQJBiFLm5mabP');
            },
            data: {
                EntityName: "VehMovingStatOverall",
                Fields: [
                    'Idle',
                    'Moving',
                    'Parking'
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
            success: function (r) {
                let rcount = r['result'].length;
                let m = 0;
                let idie = 0;
                let p = 0
                for (let i = 0; i < rcount; i++) {
                    m += r['result'][i]['Moving'];
                    idie += r['result'][i]['Idle'];
                    p += r['result'][i]['Parking'];
                }
                let vehicleStatus = document.getElementById('vehicleStatus').getContext('2d')

                let massPopChart2 = new Chart(vehicleStatus, {
                    type: 'doughnut', //bar, horizontalBar, Pir, line, doughnut, radar, polarArea
                    data: {
                        labels: ['Idie', 'Moving', 'Parking'],
                        datasets: [{
                            label: 'vehicleStatus',
                            data: [
                                idie,
                                m,
                                p,
                            ],
                            backgroundColor: [
                                '#EC0C1C',
                                '#2A9C58',
                                '#F38810',
                            ]

                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'vehicleStatus',
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                fontColor: '#222',
                                usePointStyle: true,
                            }
                        }
                    }
                })
            }
        });
    }



    function violationsDistrib() {
        $.ajax({
            url: "https://gentle-sands-79502.herokuapp.com/https://egypt.fms-tech.com/FMSAPIEgypt/api/getdata/getResult",
            method: "POST",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer SklZTubT2Eidb0Y8VHPlQJBiFLm5mabP');
            },
            data: {
                EntityName: "ViolationDistributionOverall",
                Fields: [
                    'Violation',
                    'Occurrences'
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
            success: function (r) {
                let rcount = r['result'].length;
                let v = 0;
                let o = 0;
                let d = 0;
                for (let i = 0; i < rcount; i++) {
                    d = r['result'][i]['Occurrences'];
                    v = r['result'][i]['Occurrences'];
                    o = r['result'][i]['Occurrences'];
                }
                let violationsDis = document.getElementById('violationsDis').getContext('2d')

                let massPopChart3 = new Chart(violationsDis, {
                    type: 'doughnut', //bar, horizontalBar, Pir, line, doughnut, radar, polarArea
                    data: {
                        labels: ['Driver Seat belt', 'Marsh accleration', 'Over Speeding'],
                        datasets: [{
                            label: 'Violations Distribution',
                            data: [
                                d,
                                v,
                                o
                            ],
                            backgroundColor: [
                                '#D9283A',
                                '#FCAF17',
                                '#FF596D',
                            ]
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Violations Distribution',
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                fontColor: '#222',
                                usePointStyle: true,
                            }

                        }
                    }
                })
            }
        });
    }
    (function p() {
        fn();
        vehicleStatus();
        violationsDistrib();
        setTimeout(p, 60000);
    })();
}