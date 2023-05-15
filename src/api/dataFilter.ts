export type DataType = Record<string, string | number | boolean | Date>

type FilterType = {
  label: string
  type: string
  options?: (string | Date)[]
}

export function getFilterData(data: DataType[]): { [key: string]: FilterType } {
  const filterData: { [key: string]: FilterType } = {}

  data.forEach((datum) => {
    Object.keys(datum).forEach((key) => {
      const value = datum[key]
      const valueType = typeof value

      // Add the filter data for this field if it doesn't already exist
      if (!filterData[key]) {
        let filterType = valueType === 'string' ? 'text' : valueType
        if (valueType === 'object' && value instanceof Date) {
          filterType = 'date'
        }
        filterData[key] = { label: key, type: filterType }
      }

      // Add options for fields with string or date values
      if (valueType === 'string' || (valueType === 'object' && value instanceof Date)) {
        const options = new Set<string | Date>()

        // Collect all unique values for this field
        data.forEach((datum) => {
          const optionValue = datum[key]
          if (
            typeof optionValue === 'string' ||
            (typeof optionValue === 'object' && optionValue instanceof Date)
          ) {
            options.add(optionValue)
          }
        })

        // Add the options to the filter data
        const filterOptions = Array.from(options)
        if (filterOptions.length > 1) {
          filterData[key].options = filterOptions as (string | Date)[]
        }
      }
    })
  })

  return filterData
}

export function getColumnsFromTableData(data: DataType[]) {
  if (data.length == 0) return {}
  const keysAndTypes: { [key: string]: unknown } = {}

  for (const key in data[0]) {
    keysAndTypes[key] = data[0][key] instanceof Date ? 'date' : typeof data[0][key]
  }

  return keysAndTypes
}
