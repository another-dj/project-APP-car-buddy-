window.addEventListener(
  "load",
  () => {
    console.log("Ironmaker app started successfully!");
  },
  false
);

window.addEventListener("load", () => {
  let $datedisplayhtml = document.getElementById("date-display");
  console.log($datedisplayhtml);
  return ($datedisplayhtml.innerHTML = $datedisplayhtml.innerHTML.toString().slice(4, 15));
});
