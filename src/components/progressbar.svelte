<script>
 export let value = 0;
</script>

<style>
 .progress-bar {
  position: relative; 
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
 }

 .progress {
  height: 20px;
  background-color: #4caf50;
  background-image: linear-gradient(
   -45deg,
   rgba(255, 255, 255, 0.15) 25%,
   transparent 25%,
   transparent 50%,
   rgba(255, 255, 255, 0.15) 50%,
   rgba(255, 255, 255, 0.15) 75%,
   transparent 75%,
   transparent
  );
  background-size: 40px 40px;
 }

 .progress-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #000;
 }
</style>

<div class="progress-bar">
 <div class="progress" style="width: {value}%"></div>
 <div class="progress-text">{value}%</div>
</div>
