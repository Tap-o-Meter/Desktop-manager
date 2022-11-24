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
  props: {
    data: Array,
    labels: Array,
    suffix: String
  },
  computed: {
    chartData: function() {
      return this.data;
    },
    chartLabels: function() {
      return this.labels;
    }
  },
  methods: {
    renderYaShit() {
      this.gradient2 = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);
      this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.4)");
      this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.1)");
      this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");
      this.renderChart(
        {
          labels: this.chartLabels,
          datasets: [
            {
              label: "Data One",
              borderColor: "#05CBE1",
              pointBackgroundColor: "white",
              pointBorderColor: "white",
              borderWidth: 2,
              backgroundColor: this.gradient2,
              data: this.chartData
            }
          ]
        },
        {
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            tick: [{ fontColor: "#6ab04c" }],
            xAxes: [{ gridLines: { display: false } }],
            yAxes: [
              {
                gridLines: {
                  display: true,
                  zeroLineWidth: 0,
                  drawBorder: false
                },
                ticks: {
                  beginAtZero: true,
                  callback: value => numeral(value).format("0,0")
                }
              }
            ]
          },
          tooltips: {
            callbacks: {
              label(tooltipItem, data) {
                const label = data.datasets[tooltipItem.datasetIndex].label;
                const value = numeral(tooltipItem.yLabel).format("0,0");
                return ` Ventas: ${value}`;
              }
            }
          }
        }
      );
    }
  },

  mounted() {
    this.renderYaShit();
  },
  watch: {
    data: function() {
      //this._chart.destroy();
      this.renderYaShit();
    }
  }
};
</script>
