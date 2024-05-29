import React from 'react'
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation'
import {Scatter} from 'react-chartjs-2';
ChartJS.register(LinearScale,PointElement,LineElement,Tooltip,Legend,ChartDataLabels,annotationPlugin)
export default function EmotionGraph(props){
    // To-do: use quadtree to avoid collisions. 
    const emotions=[
        {id:'expectant', x:0.663, y:0.533},
        {id: 'interested', x: 0.829, y: 0.516},
        {id: 'joyous', x: 0.977, y: 0.566},
        {id: 'passionate', x: 0.662, y: 0.565},
        {id:'amused', x: 0.779, y: 0.599},
        {id:'determined', x: 0.872, y: 0.632},
        {id: 'HAPPY', x: 0.95, y: 0.584},
        {id: 'light hearted', x: 0.713, y: 0.648},
        {id: 'enthusiastic', x: 0.753, y: 0.665},
        {id: 'DELIGHTED', x: 0.942, y: 0.684},
        {id: 'CONVINCED', x: 0.711, y: 0.714},
        {id: 'feeling superior', x: 0.66, y: 0.78},
        {id: 'courageous', x:0.909, y:0.795},
        {id: 'conceited', x: 0.595, y: 0.826},
        {id: 'ambitious', x: 0.713, y: 0.827},
        {id: 'self confident', x:0.91, y:0.828},
        {id:'EXCITED', x: 0.852, y: 0.861},
        {id: 'triumphant', x: 0.829, y: 0.893},
        {id: 'lusting', x: 0.613, y: 0.924},
        {id: 'ASTONISHED', x: 0.711, y: 0.945},
        {id: 'adventurous', x: 0.744, y: 0.962},
        {id: 'startled', x: 0.041, y:0.516},
        {id:'distrustful', x: 0.265, y: 0.548},
        {id: 'insulted', x: 0.134, y: 0.599},
        {id: 'suspicious', x: 0.344, y:0.63},
        {id: 'impatient', x: 0.481, y: 0.648},
        {id: 'bitter', x: 0.101, y: 0.632},
        {id: 'discontented', x: 0.167, y: 0.663},
        {id: 'FRUSTRATED', x:0.203, y:0.696},
        {id: 'indignant', x: 0.383, y: 0.729},
        {id: 'loathing', x: 0.101, y: 0.712},
        {id: 'disgusted', x: 0.167, y: 0.749},
        {id: 'DISTRESSED', x: 0.149, y: 0.78},
        {id: 'jealous', x: 0.464, y: 0.78},
        {id: 'contemptuous', x: 0.214, y: 0.828},
        {id: 'ANNOYED', x: 0.28, y: 0.83},
        {id: 'defient', x: 0.199, y: 0.861},
        {id: 'enraged', x: 0.417, y: 0.861},
        {id: 'ANGRY', x: 0.297, y: 0.896},
        {id: 'AFRAID', x: 0.446, y: 0.896},
        {id: 'hateful', x: 0.211, y: 0.927},
        {id: 'envious', x: 0.365, y: 0.912},
        {id: 'hostile', x: 0.363, y: 0.945},
        {id: 'ALARMED', x: 0.463, y: 0.942},
        {id: 'TENSE', x: 0.493, y: 0.926},
        {id: 'bellicose', x: 0.448, y: 0.975},
        {id: 'disappointed', x: 0.099, y: 0.484},
        {id: 'MISERABLE', x: 0.039, y: 0.434},
        {id: 'dissatisfied', x: 0.198, y:0.419},
        {id: 'taken aback', x: 0.298, y: 0.383},
        {id: 'apathetic', x: 0.402, y: 0.433},
        {id: 'uncomfortable', x: 0.166, y: 0.319},
        {id: 'worried', x: 0.463, y: 0.334},
        {id: 'SAD', x: 0.09, y: 0.301},
        {id: 'despondent', x: 0.217, y: 0.287},
        {id:'feel guilt', x: 0.3, y: 0.287},
        {id: 'GLOOMY', x: 0.066, y: 0.269},
        {id: 'desperate', x: 0.101, y: 0.253},
        {id: 'DEPRESSED', x: 0.095, y: 0.269},
        {id: 'ashamed', x: 0.282, y: 0.254},
        {id: 'languid', x: 0.387, y: 0.254},
        {id: 'embarassed', x: 0.344, y: 0.205},
        {id: 'wavering', x: 0.215, y: 0.154},
        {id: 'hesitant', x: 0.347, y: 0.139},
        {id: 'melancholic', x: 0.479, y: 0.169},
        {id: 'anxious', x: 0.138, y: 0.103},
        {id: 'BORED', x: 0.331, y: 0.106},
        {id: 'dejected', x: 0.247, y: 0.076},
        {id: 'DROOPY', x: 0.34, y: 0.04},
        {id: 'doubtful', x: 0.365, y: 0.023},
        {id: 'TIRED', x: 0.49, y: 0.008},
        {id:'impressed', x: 0.698, y: 0.468},
        {id: 'feel well', x: 0.96, y: 0.468},
        {id: 'confident', x: 0.757, y: 0.402},
        {id: 'amorous', x: 0.928, y: 0.433},
        {id: 'PLEASED', x: 0.943, y: 0.452},
        {id: 'hopeful', x: 0.811, y: 0.353},
        {id: 'GLAD', x: 0.979, y: 0.419},
        {id: 'longing', x: 0.615, y: 0.287},
        {id: 'attentive', x: 0.744, y: 0.271},
        {id: 'solemn', x: 0.909, y: 0.271},
        {id: 'SERENE', x: 0.924, y: 0.254},
        {id: 'pensive', x: 0.519, y: 0.206},
        {id: 'contemplative', x: 0.797, y: 0.206},
        {id: 'friendly', x: 0.885, y: 0.205},
        {id: 'CONTENT', x: 0.912, y: 0.223},
        {id: 'serious',  x: 0.612, y: 0.172},
        {id: 'polite', x: 0.686, y: 0.172},
        {id: 'RELAXED', x: 0.86, y: 0.173},
        {id: 'conscientious', x: 0.66, y: 0.106},
        {id: 'peaceful', x: 0.779, y: 0.106},
        {id: 'SLEEPY', x: 0.514, y: 0.01},
        {id: 'reverent', x: 0.616, y: 0.025},
        {id: 'compassionate', x: 0.692, y: 0.043}
    ];
    var annot=[
        {
            type: 'line',
            xMin: 0.5,
            xMax: 0.5,
            yMin: -0.02,
            yMax: 1.02,
            borderColor: 'white',
            borderWidth: 0.5
        },
        {
            type:'line',
            yMin: 0.5,
            yMax: 0.5,
            xMin: -0.02,
            xMax: 1.02,
            borderColor: 'white',
            borderWidth: 0.5
        },
        {
            type: 'box',
            xMin: 0.5,
            xMax: 1.02,
            yMin: 0.5,
            yMax: 1.02,
            backgroundColor: 'rgba(210,217,20,0.1)'
        },
        {
            type: 'box',
            xMin: -0.02,
            xMax: 0.5,
            yMin: 0.5,
            yMax: 1.02,
            backgroundColor: 'rgba(255,0,0,0.1)'
        },
        {
            type: 'box',
            xMin: -0.02,
            xMax: 0.5,
            yMin: -0.02,
            yMax: 0.5,
            backgroundColor: 'rgba(0,0,255,0.1)'
        },
        {
            type: 'box',
            xMin: 0.5,
            xMax: 1.02, 
            yMin: -0.02,
            yMax: 0.5,
            backgroundColor: 'rgba(23,209,23,0.1)'
        }
    ];
    emotions.map((v)=>{
        annot.push({
            type: 'point',
            xValue: v.x,
            yValue: v.y,
            radius: 3,
            backgroundColor: 'rgba(255,255,255,0.5)',
        });
        annot.push({
            type: 'label',
            xValue: v.x,
            yValue: v.y+0.02,
            color: 'white',
            //backgroundColor: 'rgba(255,255,255)',
            content: v.id
        })
    });
    const options = {
        scales:{
            y:{
                beginAtZero:false,
                min:-0.02,
                max:1.02,
                ticks:{display:false}
            },
            x:{
                beginAtZero:false,
                min:-0.02,
                max:1.02,
                ticks:{display:false}
            },
        },
        plugins:{
            datalabels:{
                color:'white',
                align:'end',
                formatter:function(value){
                    return value.id;
                }
            },
            tooltips:{
                enabled:false
            },
            legend:{display:false},
            annotation: {
                annotations: annot
            },
        }
    };
    const data = props.data;
    const Data = {
        datasets:[
            {
                data:data.map((v)=>({
                    x:v.x,
                    y:v.y,
                    id:v.id})),
                pointRadius: 5,
                backgroundColor: 'rgba(255,99,132,1)'
            },
        ]
    }
    return (
        <Scatter options={options} data={Data}/>
    );
}
