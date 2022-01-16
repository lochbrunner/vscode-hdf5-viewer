#include "highfive_handler.hh"

#include "nlohmann/json.hpp"

namespace demo {

using v8::Context;
using v8::Exception;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::ObjectTemplate;
using v8::String;
using v8::Value;

using HighFive::AnnotateTraits;
using HighFive::DataSetAccessProps;
using HighFive::DataTypeClass;
using HighFive::File;
using HighFive::ObjectType;
using Json = nlohmann::json;

HighFiveHandler::HighFiveHandler(const std::string filename)
    : _file(filename, File::ReadOnly) {}
HighFiveHandler::~HighFiveHandler() {}

void HighFiveHandler::Init(Local<Object> exports) {
  Isolate *isolate = exports->GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<ObjectTemplate> addon_data_tpl = ObjectTemplate::New(isolate);
  addon_data_tpl->SetInternalFieldCount(1); // 1 field for the
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // Prepare constructor template
  Local<FunctionTemplate> tpl =
      FunctionTemplate::New(isolate, create, addon_data);
  tpl->SetClassName(
      String::NewFromUtf8(isolate, "HighFiveHandler").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(tpl, "list", list);

  Local<Function> constructor = tpl->GetFunction(context).ToLocalChecked();
  addon_data->SetInternalField(0, constructor);
  exports
      ->Set(context,
            String::NewFromUtf8(isolate, "HighFiveHandler").ToLocalChecked(),
            constructor)
      .FromJust();
}

inline std::string getArgAsString(const FunctionCallbackInfo<Value> &args) {
  Isolate *isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  if (args.Length() < 1) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong number of arguments")
            .ToLocalChecked()));
  }
  Local<String> local_str;
  if (args[0]->ToString(context).ToLocal(&local_str)) {
    v8::String::Utf8Value utf8Str(isolate, local_str);
    return *utf8Str;
  } else {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Can not extract filename")
            .ToLocalChecked()));
    return "";
  }
}

void HighFiveHandler::create(const FunctionCallbackInfo<Value> &args) {
  Isolate *isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    const auto filename = getArgAsString(args);
    HighFiveHandler *obj = new HighFiveHandler(filename);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `HighFiveHandler(...)`, turn into construct //
    // call.
    const int argc = 1;
    Local<Value> argv[argc] = {args[0]};
    Local<Function> cons =
        args.Data().As<Object>()->GetInternalField(0).As<Function>();
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}

template <typename Derivate>
inline Json getAttributes(const AnnotateTraits<Derivate> &object) {
  Json attributes;
  for (const auto &attr_name : object.listAttributeNames()) {
    const auto attr = object.getAttribute(attr_name);
    const auto attr_type = attr.getDataType();
    if (attr_type.getClass() == DataTypeClass::String) {
      std::string str;
      attr.read(str);
      attributes[attr_name] = str;
    }
    if (attr_type.getClass() == DataTypeClass::Integer) {
      int i;
      attr.read(i);
      attributes[attr_name] = i;
    }
    if (attr_type.getClass() == DataTypeClass::Float) {
      float f;
      attr.read(f);
      attributes[attr_name] = f;
    }
  }
  return attributes;
}

void HighFiveHandler::list(const v8::FunctionCallbackInfo<v8::Value> &args) {
  Isolate *isolate = args.GetIsolate();

  auto *obj = ObjectWrap::Unwrap<HighFiveHandler>(args.Holder());

  const auto name = getArgAsString(args);
  const auto group = obj->_file.getGroup(name);
  Json j;
  for (const auto &item : group.listObjectNames()) {
    Json js = {{"name", item}};
    const auto type = group.getObjectType(item);
    switch (type) {
    case ObjectType::Group: {
      const auto inner_group = group.getGroup(item);
      js["attributes"] = getAttributes(inner_group);
      js["path"] = inner_group.getPath();
      js["type"] = "group";
    } break;
    case ObjectType::Dataset: {
      const auto props = DataSetAccessProps::Default();
      const auto dataset = group.getDataSet(item, props);
      js["attributes"] = getAttributes(dataset);
      js["path"] = dataset.getPath();
      js["type"] = "dataset";
      Json dims;
      for (const auto &dim : dataset.getDimensions()) {
        dims.push_back(dim);
      }
      js["dimensions"] = dims;
    } break;
    default:
      js["attributes"] = Json({{}});
      js["path"] = name + "/" + item;
      js["type"] = "unknown";
      break;
    }
    j.push_back(js);
  }

  args.GetReturnValue().Set(
      String::NewFromUtf8(isolate, j.dump().c_str()).ToLocalChecked());
}

} // namespace demo