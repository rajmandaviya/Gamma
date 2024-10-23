<template>
  <div class="flex justify-center">
    <div class="flex py-8 px-4 sm:px-6 lg:px-8 w-[100%] md:w-[80%] xl:w-[70%]">
      <div
        class="mx-auto rounded-lg overflow-hidden border p-4 border-gray-200 dark:border-gray-700"
      >
        <h1 class="text-3xl font-bold text-center">GARANȚIE</h1>
        <div class="p-6 space-y-8">
          <section>
            <h2 class="text-xl font-semibold mb-4">Dispoziții Generale</h2>
            <div class="space-y-2">
              <p class="">
                1. Prezentul certificat de garanție este valabil pentru toate
                produsele comercializate de compania Gamma, în conformitate cu
                legislația în vigoare.
              </p>
              <p class="">
                2. Perioada de garanție începe de la data achiziționării
                produsului și este specificată individual pentru fiecare produs
                în parte.
              </p>
            </div>
          </section>

          <!-- Condiții de Acordare -->
          <section>
            <h2 class="text-xl font-semibold mb-4">
              Condiții de Acordare a Garanției
            </h2>
            <div class="space-y-4">
              <div class="pl-4">
                <p class="font-medium">
                  1. Garanția acoperă defecțiunile de fabricație și asigură:
                </p>
                <ul class="list-disc pl-8 mt-2">
                  <li>Reparația gratuită a produsului</li>
                  <li>
                    Înlocuirea produsului cu unul similar, în cazul în care
                    reparația nu este posibilă
                  </li>
                </ul>
              </div>

              <div class="pl-4">
                <p class="font-medium">
                  2. Pentru a beneficia de garanție, clientul trebuie să
                  prezinte:
                </p>
                <ul class="list-disc pl-8 mt-2">
                  <li>Bonul fiscal sau factura în original</li>
                  <li>Certificatul de garanție completat corect și integral</li>
                  <li>Produsul în ambalajul original</li>
                  <li>
                    Toate accesoriile cu care produsul a fost livrat inițial
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Obligațiile Companiei -->
          <section>
            <h2 class="text-xl font-semibold mb-4">
              Obligațiile Companiei Gamma
            </h2>
            <div class="pl-4 space-y-4">
              <div>
                <p class="font-medium">1. Gamma se obligă să:</p>
                <ul class="list-disc pl-8 mt-2">
                  <li>
                    Repare sau să înlocuiască produsul defect în termenul legal
                  </li>
                  <li>
                    Asigure piesele de schimb necesare pe toată perioada de
                    garanție
                  </li>
                  <li>
                    Ofere consultanță tehnică pentru utilizarea corectă a
                    produsului
                  </li>
                </ul>
              </div>
              <p>
                2. Timpul de rezolvare a reclamațiilor este de maxim 15 zile
                lucrătoare de la data prezentării produsului.
              </p>
            </div>
          </section>

          <!-- Excluderi -->
          <section>
            <h2 class="text-xl font-semibold mb-4">Excluderi din Garanție</h2>
            <p class="mb-2">Garanția nu acoperă defecțiunile cauzate de:</p>
            <ul class="list-decimal pl-8">
              <li>Utilizarea necorespunzătoare a produsului</li>
              <li>Accidente, lovituri, șocuri electrice</li>
              <li>Reparații efectuate de persoane neautorizate</li>
              <li>Modificări aduse produsului de către utilizator</li>
              <li>Uzura normală a produsului</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Certificat de Garanție",
});
</script>
