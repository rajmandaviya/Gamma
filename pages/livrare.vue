<template>
  <div>
    <h1 class="text-3xl font-semibold mt-10">{{ t("Livrare") }}</h1>
    <div class="h-[500px] overflow-hidden rounded-xl mt-4">
      <img
        v-if="$i18n.locale === 'ro'"
        src="/assets/img/Livrare.webp"
        alt="Livrare"
        class="w-full"
      />
      <img
        v-if="$i18n.locale === 'ru'"
        src="/assets/img/Доставка.webp"
        alt="Доставка"
        class="w-full"
      />
    </div>
    <div class="flex justify-center">
      <div
        class="flex py-8 px-4 sm:px-6 lg:px-8 w-[100%] md:w-[80%] xl:w-[70%]"
      >
        <div
          class="mx-auto rounded-lg overflow-hidden border p-4 border-gray-200 dark:border-gray-700"
        >
          <div class="mt-8 space-y-8">
            <section>
              <h2 class="text-xl font-semibold mb-4">Livrare în Chișinău</h2>
              <p>
                Se efectuează în decurs 1 - 7 zile lucrătoare de la procesarea
                comenzii. Costul livrării pentru comanda până la 1000 lei - 80
                lei, pentru comenzile care depășesc 1000 lei - GRATUIT.
              </p>
            </section>

            <section>
              <h2 class="text-xl font-semibold mb-4">Livrare în suburbii</h2>
              <p>
                Trușeni, Vatra, Ghidighici, Grătiești, Hulboaca, Stăuceni,
                Goianul Nou, Dumbrava, Durlești, Codru, Bacioi, Sangera,
                Bubuieci, Colonița, Tohatin, Cricova, Ciorescu, Vadul lui Vodă,
                Condrița, Dobrogea, Humulești - comanda minimă va fi de 1000 lei
                și costul livrării în suburbii va fi de 50 lei.
              </p>
            </section>

            <section>
              <h2 class="text-xl font-semibold mb-4">Livrare în Moldova</h2>
              <p>
                Comanda minimă va fi de 1000 lei și costul livrării prin Moldova
                - 80 lei. Pentru comenzile care depășesc 800 lei - GRATUIT.
              </p>
            </section>

            <section>
              <h2 class="text-xl font-semibold mb-4">Important!</h2>
              <p>
                Comanda se livrează numai până în centre raionale și poate dura
                până la 7 zile.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
