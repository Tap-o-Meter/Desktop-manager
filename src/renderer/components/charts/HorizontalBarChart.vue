<script>
import { HorizontalBar } from "vue-chartjs";
import numeral from "numeral";

export default {
  extends: HorizontalBar,
  data() {
    return {
      gradient2: null
    };
  },
  props: {
    data: Array,
    labels: Array,
    onClickCallback: Function
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
          labels: this.labels,
          datasets: [
            {
              label: "",
              borderColor: "#05CBE1",
              pointBackgroundColor: "white",
              pointBorderColor: "white",
              borderWidth: 2,
              borderRadius: 10,
              backgroundColor: this.gradient2,
              data: this.data
            }
          ]
        },
        {
          legend: {
            display: false
          },
          responsive: true,
          onClick: (evt, array) =>
            array.length != 0 ? this.onClickCallback(array[0]._index) : null,
          maintainAspectRatio: false,
          scales: {
            tick: [
              {
                fontColor: "#6ab04c",
                beginAtZero: true
                // font: {
                //   family: "Material Design Icons",
                //   size: "20",
                //   color: "red"
                // }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  display: false,
                  zeroLineWidth: 0,
                  drawBorder: true
                }
              }
            ],
            xAxes: [
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
                const value = numeral(tooltipItem.xLabel).format("0,0");
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
