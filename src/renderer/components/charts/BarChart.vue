<script>
import { Bar } from "vue-chartjs";
import numeral from "numeral";

export default {
  extends: Bar,
  data() {
    return {
      gradient2: null
    };
  },
  mounted() {
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.4)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.1)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");
    this.renderChart(
      {
        labels: [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC"
        ],
        datasets: [
          {
            label: "Data One",
            borderColor: "#05CBE1",
            pointBackgroundColor: "white",
            pointBorderColor: "white",
            borderWidth: 2,
            backgroundColor: this.gradient2,
            data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          tick: [{ fontColor: "#6ab04c" }],
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [
            {
              gridLines: { display: true, zeroLineWidth: 0, drawBorder: false },
              ticks: {
                beginAtZero: true,
                callback: value => numeral(value).format("$0,0")
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              const label = data.datasets[tooltipItem.datasetIndex].label;
              const value = numeral(tooltipItem.yLabel).format("$0,0");
              return ` Ventas: ${value}`;
            }
          }
        }
      }
    );
  }
};
</script>
