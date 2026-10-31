import { useCallback } from "react";
import { useListParams } from "../../../shared/hooks/useListParams";
import { usePageClamp } from "../../../shared/hooks/usePageClamp";
import { useSelection } from "../../../shared/hooks/useSelection";
import { LIST_DEFAULTS } from "../constants";
import { useEmailActions } from "./useEmailActions";
import { useEmailList } from "./useEmailList";

/** Everything a list page needs: URL params, the server page, cross-page selection and actions. */
export function useEmailListPage(view) {
  const { params, update } = useListParams(LIST_DEFAULTS[view]);
  const list = useEmailList(view, params);
  const filters = { view, read: params.read, search: params.search };
  const selection = useSelection(`${view}|${params.read}|${params.search}`);
  const page = Number(params.page);

  const setPage = useCallback((next) => update({ page: next }, { resetPage: false }), [update]);
  usePageClamp(list.data?.meta, page, setPage);

  const actions = useEmailActions({
    onDone: () => {
      selection.clear();
      list.reload();
    },
  });

  return { params, update, setPage, list, filters, selection, actions };
}
