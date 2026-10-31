import { SearchInput, SelectField, Tabs } from "../../../shared/ui";
import { READ_TABS, SORT_OPTIONS } from "../constants";

/** Search, optional read-state tabs and sort for an email list; `inline` puts search and sort on one row. Changes go to the server via `update`. */
export function EmailFilters({ params, update, showReadTabs, inline = false }) {
  const sort = (
    <SelectField
      sort
      label="Sort by"
      value={`${params.sort}:${params.order}`}
      options={SORT_OPTIONS}
      onChange={(value) => update({ sort: value.split(":")[0], order: value.split(":")[1] })}
    />
  );
  const searchBox = (
    <SearchInput
      value={params.search}
      onSearch={(term) => update({ search: term })}
      label="Search emails"
      placeholder="Search by sender, product or subject"
    />
  );

  if (inline) return <div className="filters-inline">{searchBox}{sort}</div>;

  return (
    <>
      {searchBox}
      <div className="tabs-row">
        {showReadTabs ? <Tabs label="Read state" options={READ_TABS} value={params.read} onChange={(read) => update({ read })} /> : <span />}
        {sort}
      </div>
    </>
  );
}
