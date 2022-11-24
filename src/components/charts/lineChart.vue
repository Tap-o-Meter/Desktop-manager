<script>
import { Line } from "vue-chartjs";
import numeral from "numeral";
export default {
  extends: Line,
  data() {
    return {
      gradient2: null
    };
  },
  computed: {
    chartData: function() {
      return this.data;
    },
    chartLabels: function() {
      return this.labels;
    }
  },
  props: {
    data: Array,
    labels: Array,
    name: String,
    suffix: String
  },
  methods: {
    renderYaShit() {
      this.gradient2 = this.$refs.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 450);

      this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
      this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
      this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

      this.renderChart(
        {
          labels: this.chartLabels,
          datasets: [
            {
              label: this.name,
              borderColor: "#05CBE1",
              pointBackgroundColor: "#05CBE1",
              pointBorderColor: "#05CBE1",
              borderWidth: 2,
              backgroundColor: this.gradient2,
              data: this.chartData,
              suffix: this.suffix
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
            xAxes: [
              {
                ticks: { fontColor: "white" },
                gridLines: {
                  color: "rgba(230,230,230,.08)"
                  //display: false
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "white",
                  beginAtZero: true,
                  callback: value => value + " " + this.suffix
                },
                gridLines: { display: false }
              }
            ]
          },
          tooltips: {
            callbacks: {
              label(tooltipItem, data) {
                const label = data.datasets[tooltipItem.datasetIndex].label;
                const value = tooltipItem.yLabel;
                return ` ${label}: ${value}${
                  data.datasets[tooltipItem.datasetIndex].suffix
                }`;
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
