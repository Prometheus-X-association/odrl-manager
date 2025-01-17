# Namespaces in ODRL Policy Handling

## Overview
Namespaces in ODRL (Open Digital Rights Language) policies provide context and prevent naming conflicts for properties. This approach enables domain-specific extensions while maintaining interoperability. Namespaces are declared in the policy's `@context` field and are linked to unique URIs.

## Key Concepts

1. **Namespace Declaration**:
   - Namespaces are declared in the ODRL policy JSON's `@context` field.
   - Multiple namespaces can exist in the same policy.
   - Example:
     ```json
     "@context": [
       "http://www.w3.org/ns/odrl.jsonld", // Default ODRL context
       {
         "gr": "http://purl.org/goodrelations/", // Custom namespace for GoodRelations
         "dc": "http://purl.org/dc/terms/" // Custom namespace for Dublin Core
       }
     ]
     ```

2. **Namespace Instantiation**:
   - Namespaces are instantiated using the `Namespace` class in the code.
   - Each namespace links to a URI and can contain property-specific instantiators.
   - Example:
     ```typescript
     const grNamespace = new Namespace('http://purl.org/goodrelations/');
     PolicyInstanciator.addNamespaceInstanciator(grNamespace);
     ```

3. **Adding Instantiators**:
   - Instantiators are functions that create objects from JSON data for namespace properties.
   - Example:
     ```typescript
     grNamespace.addInstanciator('UnitPriceSpecification', GoodRelations.UnitPriceSpecification);
     grNamespace.addInstanciator('PaymentMethod', GoodRelations.PaymentMethod);
     ```

4. **Handling Namespaced Properties**:
   - During policy traversal, prefixed properties (e.g., `gr:UnitPriceSpecification`) are checked against declared namespaces.
   - When found, the matching instantiator creates the object.
   - Example:
     ```json
     {
       "gr:UnitPriceSpecification": {
         "gr:hasCurrency": "EUR",
         "gr:hasCurrencyValue": 5,
         "gr:priceType": "Purchase"
       }
     }
     ```

5. **Impact on ODRL Policies**:
   - Namespaces let ODRL policies include domain extensions like pricing (`gr:UnitPriceSpecification`) or metadata (`dc:creator`).
   - This ensures flexibility while maintaining ODRL core model compatibility.

## Example

### ODRL Policy JSON with Multiple Namespaces
```json
{
  "@context": [
    "http://www.w3.org/ns/odrl.jsonld", 
    {
      "gr": "http://purl.org/goodrelations/",
      "dc": "http://purl.org/dc/terms/"
    }
  ],
  "@type": "Offer",
  "uid": "http://example.com/policy:88",
  "permission": [
    {
      "target": "http://example.com/music/1999.mp3",
      "action": "play",
      "duty": [
        {
          "action": "compensate",
          "constraint": [
            {
              "leftOperand": "payAmount",
              "operator": "eq",
              "rightOperand": 5,
              "unit": "EUR",
              "gr:UnitPriceSpecification": {
                "gr:hasCurrency": "EUR",
                "gr:hasCurrencyValue": 5,
                "gr:priceType": "Purchase"
              }
            }
          ]
        }
      ],
      "dc:creator": "http://example.com/creator:sony"
    }
  ]
}
```

### Instantiator for `gr:UnitPriceSpecification`
```typescript
class GoodRelations {
  static UnitPriceSpecification(element: any): Extension {
    return {
      name: 'gr:UnitPriceSpecification',
      value: new UnitPriceSpecification(
        element['gr:hasCurrency'],
        element['gr:hasCurrencyValue'],
        element['gr:priceType']
      ),
    };
  }
}
```

### Instantiator for `dc:creator`
```typescript
class DublinCore {
  static Creator(element: any): Extension {
    return {
      name: 'dc:creator',
      value: element,
    };
  }
}
```

## Conclusion
ODRL policy namespaces enable domain-specific extensions while preserving interoperability. The `@context` field declarations and instantiators support various use cases, from e-commerce to metadata management. This modular design ensures adaptability and clean namespace separation.