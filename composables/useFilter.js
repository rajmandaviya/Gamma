import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

export const checkQuieries = (variants, q) => {
  console.log('Run Chceker Queries');
  if (Object.values(q).filter((v) => v !== null).length === 3) {
    const product = variants.filter(
      (v) =>
        v.Cod_Culoare === q.color &&
        v.Valoare_Atribute_1 === q.var_1 &&
        v.Valoare_Atribute_2 === q.var_2
    );
    // varinatProduct.value = product;
    // console.log(varinatProduct.value);
    // console.log(product);
    return product[0];
  }

  if (Object.values(q).filter((v) => v !== null).length === 3) {
    const product = variants.filter(
      (v) =>
        v.Cod_Culoare === query.value.color &&
        v.Valoare_Atribute_1 === query.value.var_1 &&
        v.Valoare_Atribute_2 === query.value.var_2
    );
    // varinatProduct.value = product;
    // console.log(varinatProduct.value);
    // console.log(product);
    return product[0];
  }

  return {};
};
export const useFilter = (variants, variantProduct) => {
  const { locale } = useI18n();
  const router = useRouter();
  const { path, query: q } = useRoute();
  const query = ref(q);

  const colors = ref([]);
  const varsAttr1 = ref([]);
  const varsAttr2 = ref([]);

  const color = ref(query.value.color ??null);
  const var_1 = ref(query.value.var_1 ?? null);
  const var_2 = ref(query.value.var_2 ?? null);

  // SETTERS
  const setColors = () => {
    const _ = new Set();
    variants.forEach((variant) => {
      if (variant.Cod_Culoare) _.add(variant.Cod_Culoare);
    });
    colors.value = Array.from(_);
  };
  const setVarsAttr1 = () => {
    const _ = new Set();
    variants.forEach((variant) => {
      if (variant.Valoare_Atribute_1) _.add(variant.Valoare_Atribute_1);
    });
    varsAttr1.value = Array.from(_).sort((a, b) => a - b);
  };
  const setVarsAttr2 = () => {
    const _ = new Set();
    variants.forEach((variant) => {
      if (variant.Valoare_Atribute_2) _.add(variant.Valoare_Atribute_2);
    });
    varsAttr2.value = Array.from(_).sort((a, b) => a - b);
  };

  // GETTERS
  const getAttr1name = () => {
    return locale.value === 'ru'
      ? variants[0].Atribut_1_RU
      : variants[0].Atribut_1_RO;
  };
  const getAttr2name = () => {
    return locale.value === 'ru'
      ? variants[0].Atribut_2_RU
      : variants[0].Atribut_2_RO;
  };

  const changeColor = (c) => {
    color.value = c;
  };

  // WATCHER
  // watch([() => color.value, () => var_1.value, () => var_2.value], () => {
  //   query.value = {
  //     ...query.value,
  //     color: color.value,
  //     var_1: _var_1.value,
  //     var_2: _var_2.value,
  //   };
  //   router.push({ path, query: query.value });
  // });

  watch(
    [() => color.value, () => var_1.value, () => var_2.value],
    () => {
      query.value = {
        ...query.value,
        color: color.value,
        var_1: var_1.value,
        var_2: var_2.value,
      };
      router.push({ path, query: query.value });
      // console.log(variantProduct.value);
      variantProduct.value = checkQuieries(variants, query.value);
    },
    { deep: true }
  );

  return {
    locale,
    router,
    path,
    q,
    query,
    colors,
    varsAttr1,
    varsAttr2,
    color,
    var_1,
    var_2,
    setColors,
    setVarsAttr1,
    setVarsAttr2,
    getAttr1name,
    getAttr2name,
    checkQuieries,
    changeColor,
  };
};
