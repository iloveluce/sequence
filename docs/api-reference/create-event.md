# Event

{% api-method method="post" host="https://api.cakes.com" path="/event/batch" %}
{% api-method-summary %}
Create Event
{% endapi-method-summary %}

{% api-method-description %}
Create an Event associated with a particular Person. Based off the Segment specification, we currently support the following event types:  
- Track  
- Identify  
  
Note: Events with anonymous users are not currently supported.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-headers %}
{% api-method-parameter name="Authentication" type="string" required=true %}
Form of Authentication: Bearer {token}
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-body-parameters %}
{% api-method-parameter name="batch" type="array" required=true %}
Event payload, either a "track" or "identify" call, following the Segment event specification. 
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
Cake successfully retrieved.
{% endapi-method-response-example-description %}

```
{    "name": "Cake's name",    "recipe": "Cake's recipe name",    "cake": "Binary cake"}
```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=404 %}
{% api-method-response-example-description %}
Could not find a cake matching this query.
{% endapi-method-response-example-description %}

```
{    "message": "Ain't no cake like that."}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

### 

