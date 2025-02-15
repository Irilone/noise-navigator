from langfuse.decorators import observe, langfuse_context
import anthropic
 
@observe()
def fn():
    langfuse_context.get_current_trace_url()
 
fn()
 
anthopic_client = anthropic.Anthropic()
 
# Wrap LLM function with decorator
@observe(as_type="generation")
def anthropic_completion(**kwargs):
  # optional, extract some fields from kwargs
  kwargs_clone = kwargs.copy()
  input = kwargs_clone.pop('messages', None)
  model = kwargs_clone.pop('model', None)
  langfuse_context.update_current_observation(
      input=input,
      model=model,
      metadata=kwargs_clone
  )
 
  response = anthopic_client.messages.create(**kwargs)
 
  # See docs for more details on token counts and usd cost in Langfuse
  # https://langfuse.com/docs/model-usage-and-cost
  langfuse_context.update_current_observation(
      usage_details={
          "input": response.usage.input_tokens,
          "output": response.usage.output_tokens
      }
  )
 
  # return result
  return response.content[0].text
 
@observe()
def main():
  return anthropic_completion(
      model="claude-3-opus-20240229",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Hello, Claude"}
      ]
  )
 
main()
