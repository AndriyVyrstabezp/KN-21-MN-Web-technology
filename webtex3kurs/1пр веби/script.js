const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
        datasets: [{
            label: 'Температура (°C)',
            data: [15, 17, 19, 18, 16, 14, 13],
            borderColor: 'rgba(255, 99, 71, 1)',        // червоний (лінія)
            backgroundColor: 'rgba(255, 165, 0, 0.3)', // помаранчевий (заливка)
            pointBackgroundColor: 'rgba(255, 215, 0, 1)', // золоті точки
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#333'
                }
            },
            title: {
                display: true,
                text: 'Осінні температури у с. Дев’ятники (А.В.)',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                color: '#b34700'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Температура (°C)',
                    color: '#b34700'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Дні тижня',
                    color: '#b34700'
                }
            }
        }
    }
});
