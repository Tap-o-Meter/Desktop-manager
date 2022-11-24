<script>
import { Doughnut } from "vue-chartjs";
import numeral from "numeral";
export default {
  extends: Doughnut,
  props: ["chartData"],
  methods: {
    update() {
      this.$data._chart.update();
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  data() {
    return {
      options: {
        cutoutPercentage: 60,
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: false
        },
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              const label = data.labels[tooltipItem.index];
              const value = data.datasets[0].data[tooltipItem.index];
              return ` ${label}: ${value}Gb`;
            }
          }
        }
      }
    };
  }
};
</script>
