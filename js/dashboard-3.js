
//======== PAGE: DASHBOARD ===========//

let pageName = document.location.pathname.match(/[^\/]+$/)[0];

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

today = mm + '-' + dd + '-' + yyyy;
endToday = mm + '-' + dd + '-' + yyyy+' 23:59:59';
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
                    let test = data.result[0][v];
                    $("#"+v).html(test)
                    let el = $('.'+v);
                    let href = el.data('index');
                    el.attr('href', href+"?v="+v+"&num="+test);
                    if(k == 'OverspeedCountOverall') {
                        let overSpeed = data.result[0]['Occ'];
                        $("#overSpeed").html(overSpeed);
                        let el = $('.overSpeed');
                        let href = el.data('index');
                        el.attr('href', href+"?v=overSpeed&num="+overSpeed);
                    }
                    if(k == 'ViolationsCountOverall') {
                        let eventViolation = data.result[0]['Occ'];
                        $("#eventViolation").html(eventViolation);
                        let el = $('.eventViolation');
                        let href = el.data('index');
                        el.attr('href', href+"?v=eventViolation&num="+eventViolation);
                    }
                    if(k == 'RestViolationOverall') {
                        let restViolations = data.result[0]['RestViolations'];
                        $("#restViolations").html(restViolations);
                        let el = $('.restViolations');
                        let href = el.data('index');
                        el.attr('href', href+"?v=restViolations&num="+restViolations);
                    }
                    if(k == 'PowerFailureOverall') {
                        let powerFailure = data.result[0]['Occ'];
                        $("#powerFailure").html(powerFailure);
                        let el = $('.powerFailure');
                        let href = el.data('index');
                        el.attr('href', href+"?v=powerFailure&num="+powerFailure);
                    }
                }
            });
        });
    }



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
                        labels: ['Idle', 'Moving', 'Parking'],
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
            success: function (r) {
                let rcount = r['result'].length;
                let v = 0;
                let o = 0;
                let d = 0;
                d = r['result'][0]['Occurrences'];
                v = r['result'][1]['Occurrences'];
                o = r['result'][2]['Occurrences'];
                let violationsDis = document.getElementById('violationsDis').getContext('2d')

                let massPopChart3 = new Chart(violationsDis, {
                    type: 'doughnut', //bar, horizontalBar, Pir, line, doughnut, radar, polarArea
                    data: {
                        labels: ['Driver Seat belt', 'Harsh accleration', 'Over Speeding'],
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
    function chart() { // column chart
        $.ajax({
            url: "https://gentle-sands-79502.herokuapp.com/https://egypt.fms-tech.com/FMSAPIEgypt/api/getdata/getResult",
            method: "POST",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer SklZTubT2Eidb0Y8VHPlQJBiFLm5mabP');
            },
            data: {
                EntityName: "RestViolationRegionSiteWise",
                Fields: [
                    "Region",
                    "Site",
                    "Occurrences"
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
                r = data['result'];
                let totalPCE = 0;
                let totalCFI = 0;
                let area1 = 0;
                let area2 = 0;
                for(let i=0;i<r.length;i++) {
					console.log(data['result']);
                    if (r[i]['Site'].includes("PCE")) {
                        totalPCE += r[i]["Occurrences"];
                    }
                    if (r[i]['Site'].includes("CFI")) {
                        totalCFI += r[i]["Occurrences"];
                    }
                    if (r[i]['Site'].includes("Amrya")) {
                        area1 = r[i]["Occurrences"];
                    }
                    if (r[i]['Site'].includes("Tanta")) {
                        area2 = r[i]["Occurrences"];
                    }
                }
                let myChart = document.getElementById('myChart').getContext('2d')
                let massPopChart = new Chart(myChart, {
                    type: 'bar', //bar, horizontalBar, Pir, line, doughnut, radar, polarArea
                    data: {
                        labels: ['CFI Deployment', 'PCE Deployment', 'PCE Deployment Amerya', 'PCE Deployment Tanta', 'Violations'],
                        datasets:[{
                            label: 'Violations',
                            data:[
                                totalCFI,
                                totalPCE,
                                area1,
                                area2,
                                01,
                            ],
                            backgroundColor: '#1CACF4'
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: 'Continuous Working Violations',
                        },
                        legend: {
                            position: 'right',
                            labels: {
                                fontColor: '#222'
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
        chart();
        setTimeout(p, 60000);
    })();

    $('.filter-btn').on('click', function (){
        let region = $("#region").val();
        let sites = $("#sites").val();
        let PredefinedDate = $("#PredefinedDate").val();
        let fDate = $("#from-date").val();
        let tDate = $("#to-date").val();
        //let fTime = $("#from-time").val();
        //let tTime = $("#to-time").val();
        console.log(PredefinedDate);
        if(region == 0 && sites == 0 && PredefinedDate == 0 && fDate == 0) {
            let html = "<div style='position: absolute;right: 20px' class=\"alert alert-warning alert-3\" role=\"alert\"> Please select at least one field !! </div>"
            $('.filter-btn').after(html);
            function t(){
                $(".alert-3").hide()
            }
            setTimeout(t, 3000);
        }else{
            return window.open('./filter.html?r=' + region + '&s=' + sites + '&preDate=' + PredefinedDate + '&fdate=' + fDate + '&tdate=' + tDate, '_self');
        }
    });
}
