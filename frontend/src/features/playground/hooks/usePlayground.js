import { useEffect, useState } from "react";
import { analyzeEmail, fetchUsage } from "../api/playgroundApi";
import { MAX_PRODUCTS } from "../constants";
import { newRowId } from "../lib/rowId";
import { SAMPLE_EMAIL, SAMPLE_PRODUCTS } from "../lib/sampleData";
import { toPayload, validatePlayground } from "../lib/validate";

const TOO_MANY_REQUESTS = 429;

const makeProduct = (product = { name: "", itemCode: "", aliases: "" }) => ({ ...product, id: newRowId() });

/** State and actions for the playground: the product list, the email, the AI result and the free-request counter. */
export function usePlayground() {
  const [products, setProducts] = useState(() => SAMPLE_PRODUCTS.map(makeProduct));
  const [email, setEmail] = useState(SAMPLE_EMAIL);
  const [usage, setUsage] = useState(null);
  const [problems, setProblems] = useState({});
  const [state, setState] = useState({ status: "idle", result: null, error: "" });

  useEffect(() => {
    const controller = new AbortController();

    fetchUsage(controller.signal).then(setUsage, () => {});

    return () => controller.abort();
  }, []);

  const analyze = async () => {
    const found = validatePlayground(products, email);

    setProblems(found);
    if (Object.keys(found).length > 0) return;

    setState({ status: "loading", result: null, error: "" });
    try {
      const data = await analyzeEmail(toPayload(products, email));

      setUsage(data.usage);
      setState({ status: "done", result: data.result, error: "" });
    } catch (error) {
      if (error.status === TOO_MANY_REQUESTS) setUsage((current) => ({ limit: current?.limit ?? 0, remaining: 0 }));
      setState({ status: "error", result: null, error: error.message });
    }
  };

  return {
    products,
    email,
    usage,
    problems,
    ...state,
    canAddProduct: products.length < MAX_PRODUCTS,
    exhausted: usage !== null && usage.remaining <= 0,
    setEmail,
    addProduct: () => setProducts((current) => (current.length < MAX_PRODUCTS ? [...current, makeProduct()] : current)),
    removeProduct: (id) => setProducts((current) => current.filter((product) => product.id !== id)),
    changeProduct: (id, field, value) => setProducts((current) => current.map((product) => (product.id === id ? { ...product, [field]: value } : product))),
    reset: () => {
      setProducts(SAMPLE_PRODUCTS.map(makeProduct));
      setEmail(SAMPLE_EMAIL);
      setProblems({});
      setState({ status: "idle", result: null, error: "" });
    },
    analyze,
  };
}
