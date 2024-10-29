'use client'

import React, { useEffect, useState, useCallback, Fragment } from 'react'

import {
  Button,
  FieldLabel, // Re-use the built in Label component directly from Payload
  useField,
  useFieldProps,
  usePreferences,
} from '@payloadcms/ui'

import { TextFieldClientProps } from 'payload'

import './styles-tailwind.css' // TO DO: Only load this if tailwind is enabled?
import './index.css'

const baseClass = 'color-swatch-field'

type ColorSwatchProps = {
  readonly defaultColors: string[]
  readonly lockDefaultColors: boolean
  readonly allowNull: boolean
  readonly allowUserPreferences: boolean
  readonly useGlobalPreferences: boolean
  readonly allowTailwindColors: boolean
  readonly tailwindColorWhitelist: string[]
  readonly allowHexColors: boolean
} & TextFieldClientProps

const isTailwindColor = (color: string, tailwindColorWhitelist: string[]): boolean => {
  return (
    color && // Check to ensure it isn't null
    tailwindColorWhitelist.includes(color)
  )
}

export const ColorSwatchComponent: React.FC<ColorSwatchProps> = ({
  defaultColors,
  lockDefaultColors,
  allowNull,
  allowUserPreferences,
  useGlobalPreferences,
  allowTailwindColors,
  tailwindColorWhitelist,
  allowHexColors,
  field,
}) => {
  const { label } = field
  const { path, readOnly: readOnlyFromProps } = useFieldProps()

  const { value = '', setValue } = useField({ path })

  const defaultPreferenceKey = useGlobalPreferences
    ? 'default-color-swatch-colors'
    : field.name + '-default-color-swatch-colors'
  const customPreferenceKey = useGlobalPreferences
    ? 'custom-color-swatch-colors'
    : field.name + '-custom-color-swatch-colors'

  const { getPreference, setPreference } = usePreferences()

  const [defaultColorOptions, setDefaultColorOptions] = useState([
    allowNull && null, // default options will include an array of null (if configured)
    ...defaultColors.filter((element: string) => {
      // Filter any user input to ensure they're proper values
      return (
        (allowHexColors && element.startsWith('#')) || // If hex value
        (allowTailwindColors && isTailwindColor(element, tailwindColorWhitelist)) // If a tailwind color
      )
    }),
  ])
  const [customColorOptions, setCustomColorOptions] = useState([])

  const [isAdding, setIsAdding] = useState(false)
  const [colorToAdd, setColorToAdd] = useState('')
  const [selectedTailwindColor, setSelectedTailwindColor] = useState('')

  useEffect(() => {
    if (allowUserPreferences) {
      // If custom colors are allowed, then get the user's color preferences
      const getColorPreferences = async () => {
        if (!lockDefaultColors) {
          const defaultColorPreferences = await getPreference<string[]>(defaultPreferenceKey)

          if (
            defaultColorPreferences &&
            defaultColorPreferences !== undefined &&
            defaultColorPreferences.length != 0
          ) {
            setDefaultColorOptions(defaultColorPreferences)
          }
        }

        const customColorPreferences = await getPreference<string[]>(customPreferenceKey)

        if (
          customColorPreferences &&
          customColorPreferences !== undefined &&
          customColorPreferences.length != 0
        ) {
          setCustomColorOptions(customColorPreferences)
        }
      }

      getColorPreferences()
    }
  }, [])

  const handleAddColor = useCallback(() => {
    // This can only run when 'allowUserPreferences' is true
    setIsAdding(false)
    setValue(colorToAdd)

    // Prevent adding duplicates
    if (customColorOptions.indexOf(colorToAdd) > -1) return

    // Add the color
    let newOptions = customColorOptions
    newOptions.push(colorToAdd)

    // Update state with new colors
    setCustomColorOptions(newOptions)

    // Store the user color preferences for future use
    setPreference(customPreferenceKey, newOptions)
  }, [value, colorToAdd, customColorOptions, setPreference])

  const handleRemoveColor = useCallback(() => {
    if (!lockDefaultColors && defaultColorOptions.includes(value as string)) {
      // Remove the color
      let newOptions = defaultColorOptions.filter((color) => {
        return color !== value
      })

      // Update state with new colors
      setDefaultColorOptions(newOptions)

      // Store the user color preferences for future use
      setPreference(defaultPreferenceKey, newOptions)
    } else {
      // Remove the color
      let newOptions = customColorOptions.filter((color) => {
        return color !== value
      })

      // Update state with new colors
      setCustomColorOptions(newOptions)

      // Store the user color preferences for future use
      setPreference(customPreferenceKey, newOptions)
    }

    setValue('')
  }, [value, defaultColorOptions, customColorOptions, setPreference])

  return (
    <div className={baseClass}>
      <FieldLabel field={field} htmlFor={path} label={label} />

      {isAdding && (
        <div>
          {allowTailwindColors && (
            <>
              <select
                value={selectedTailwindColor}
                onChange={(e) => {
                  setSelectedTailwindColor(e.target.value)
                  setColorToAdd(e.target.value)
                }}
              >
                <option value="" key="tailwind-colors-all">
                  Tailwind color
                </option>
                {tailwindColorWhitelist.map((color, i) => (
                  <option value={color} key={i} className={color}>
                    {color}
                  </option>
                ))}
              </select>
              &nbsp;
            </>
          )}
          {allowHexColors && (
            <input
              className={`${baseClass}__input`}
              type="text"
              placeholder="#000000"
              onChange={(e) => {
                setSelectedTailwindColor('')
                setColorToAdd(e.target.value)
              }}
              value={colorToAdd}
            />
          )}
          <br />
          <Button
            className={`${baseClass}__btn`}
            buttonStyle="primary"
            iconPosition="left"
            iconStyle="with-border"
            size="small"
            onClick={handleAddColor}
          >
            Add
          </Button>
          &nbsp;
          <Button
            className={`${baseClass}__btn`}
            buttonStyle="secondary"
            iconPosition="left"
            iconStyle="with-border"
            size="small"
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </Button>
        </div>
      )}
      {!isAdding && (
        <Fragment>
          <ul className={`${baseClass}__colors`}>
            {defaultColorOptions.map((color, i) => (
              <li key={i} className={`${baseClass}__color-default`}>
                <button
                  type="button"
                  key={color ? color : 'transparent'}
                  className={`chip ${!color ? 'no-color' : ''} ${
                    color === value ? 'chip--selected' : ''
                  } ${
                    color && isTailwindColor(color, tailwindColorWhitelist) && color
                  } chip--clickable`}
                  style={
                    // Hex values should be inline background
                    {
                      backgroundColor: color && color.startsWith('#') && color,
                    }
                  }
                  onClick={() => setValue(color)}
                  title={color && color}
                >
                  {
                    color &&
                      !color.startsWith('#') &&
                      String.fromCharCode(65 + i) + String.fromCharCode(97 + i) // Generate Alphanumeric text
                  }
                </button>
              </li>
            ))}
            {allowUserPreferences && customColorOptions.length > 0 && (
              <>
                <li className={`${baseClass}__color-custom-separator`}></li>
                {customColorOptions.map((color, i) => (
                  <li key={i} className={`${baseClass}__color-custom`}>
                    <button
                      type="button"
                      key={color ? color : 'transparent'}
                      className={`chip ${!color ? 'no-color' : ''} ${
                        color === value ? 'chip--selected' : ''
                      } ${
                        color && isTailwindColor(color, tailwindColorWhitelist) && color
                      } chip--clickable`}
                      style={
                        // Hex values should be inline background
                        {
                          backgroundColor: color && color.startsWith('#') && color,
                        }
                      }
                      onClick={() => setValue(color)}
                      title={color && color}
                    >
                      {color &&
                        !color.startsWith('#') &&
                        String.fromCharCode(
                          // Generate Alphanumeric text
                          65 + i + defaultColorOptions.length + 1,
                        ) + String.fromCharCode(97 + i + defaultColorOptions.length + 1)}
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>
          {allowUserPreferences && (
            <Button
              className="add-color"
              icon="plus"
              tooltip="Add color"
              buttonStyle="icon-label"
              iconPosition="left"
              iconStyle="with-border"
              onClick={() => {
                setIsAdding(true)
                setValue('')
              }}
            />
          )}
          {value && // Display remove color button
            allowUserPreferences && // If custom colors are allowed
            ((lockDefaultColors && !defaultColors.includes(value as string)) || // If value isn't in default colors, and default colors are locked
              !lockDefaultColors) && (
              <Button
                className="remove-color"
                icon="x"
                tooltip="Remove color"
                buttonStyle="icon-label"
                iconPosition="left"
                iconStyle="with-border"
                onClick={handleRemoveColor}
              />
            )}
        </Fragment>
      )}
    </div>
  )
}
