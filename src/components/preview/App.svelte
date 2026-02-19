<script>
  import Button from "./playground/Button.svelte"
  import Spinner from "./playground/Spinner.svelte"
  import TextInput from "./playground/TextInput.svelte"
  import Label from "./playground/Label.svelte"
  import Checkbox from "./playground/Checkbox.svelte"
  import Toggle from "./playground/Toggle.svelte"
  import Select from "./playground/Select.svelte"
  import Icon from "./playground/Icon.svelte"
  import Radio from "./playground/Radio.svelte"
</script>

<header>
  <h1 class="src-titlepiece-42">Interactive Source components</h1>
</header>

<section>
  <Button />
  <Spinner />
  <TextInput />
  <Label />
  <Checkbox />
  <Toggle />
  <Select />
  <Radio />
  <Icon />
</section>

<style>
  :global {
    * {
      box-sizing: border-box;
    }

    body {
      font-family:
        GuardianTextSans, "Guardian Text Sans Web", "Helvetica Neue", Helvetica,
        Arial, sans-serif;
      max-width: 940px;
      margin: 0 auto;

      background-color: white;

      border-left: 1px solid var(--src-neutral-86);
      border-right: 1px solid var(--src-neutral-86);

      padding-top: 48px;
      padding-bottom: 64px;
    }

    h1 {
      margin: 0;
    }

    header {
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 20px;
    }

    legend {
      font-weight: bold;
      font-size: 0.75rem;
      color: #707070;
      margin-bottom: 0.25rem;
    }

    fieldset {
      border: 0;
      padding: 0;
      margin: 0;
      min-width: 0;
    }

    fieldset label {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      margin-right: 0.75rem;
      font-size: 0.875rem;
      cursor: pointer;
    }
  }
</style>
