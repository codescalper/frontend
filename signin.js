function createPolotnoEditor(config) {
  // listen for publish event
  const handlePublish = (event) => {
    if (event.data?.type !== 'publish') {
      return;
    }
    // You might want to check for origin, for security reasons
    if (event.data?.dataURL && config.onPublish) {
      config.onPublish({ ...event.data });
      destroy();
    }
  };
  window.addEventListener('message', handlePublish, false);

  // listen for change event
  const handleChange = (event) => {
    if (event.data?.type !== 'change') {
      return;
    }
    // You might want to check for origin, for security reasons
    if (event.data?.json && config.onChange) {
      config.onChange({ ...event.data });
    }
  };
  window.addEventListener('message', handleChange, false);

  // create container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0px';
  container.style.left = '0px';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.zIndex = '10000';

  document.body.appendChild(container);

  const backdrop = document.createElement('div');
  backdrop.style.position = 'absolute';
  backdrop.style.top = '0px';
  backdrop.style.left = '0px';
  backdrop.style.width = '100%';
  backdrop.style.height = '100%';
  backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)';
  backdrop.style.display = 'block';
  container.appendChild(backdrop);
  backdrop.onclick = () => {
    destroy();
  };

  const destroy = () => {
    window.removeEventListener('message', handlePublish, false);
    window.removeEventListener('message', handleChange, false);
    container.parentElement.removeChild(container);
  };

  // setup iframe
  const iframe = document.createElement('iframe');
  container.appendChild(iframe);
  iframe.style.width = 'calc(100vw - 50px)';
  iframe.style.height = window.innerHeight - 60 + 'px';
  iframe.style.minWidth = '400px';
  iframe.style.maxWidth = '100vw';
  iframe.style.position = 'absolute';
  iframe.style.top = '50px';
  iframe.style.left = '50%';
  iframe.style.transform = 'translate(-50%)';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '5px';

  window.addEventListener('resize', () => {
    iframe.style.height = window.innerHeight - 60 + 'px';
  });

  let src = `https://embed.polotno.com?KEY=${config.key}&width=${config.width}&height=${config.height}`;
  if (config.sections) {
    src += `&sections=${config.sections.join(',')}`;
  }

  if (config.jsonUrl) {
    src += `&jsonUrl=${config.jsonUrl}`;
  }

  if (config.publishLabel) {
    src += `&publishLabel=${config.publishLabel}`;
  }

  if (config.animationsEnabled) {
    src += `&animationsEnabled=${config.animationsEnabled}`;
  }

  iframe.src = src;

  // pass some data to iframe
  if (config.json) {
    iframe.addEventListener('load', () => {
      iframe.contentWindow.postMessage(
        {
          type: 'jsonLoad',
          json: config.json,
        },
        '*'
      );
    });
  }

  if (config.uploads) {
    iframe.addEventListener('load', () => {
      iframe.contentWindow.postMessage(
        {
          type: 'setUploads',
          uploads: config.uploads,
        },
        '*'
      );
    });
  }

  if (config.uploadFunc) {
    // listen for publish event
    const handleUpload = async (event) => {
      if (event.data?.type !== 'upload') {
        return;
      }
      // You might want to check for origin, for security reasons
      if (event.data?.dataURL) {
        const url = await config.uploadFunc({ dataURL: event.data.dataURL });
        iframe.contentWindow.postMessage(
          {
            type: 'uploadComplete',
            url,
            id: event.data.id,
          },
          '*'
        );
      }
    };
    window.addEventListener('message', handleUpload, false);
  }

  return {
    destroy: destroy,
  };
}

window.createPolotnoEditor = createPolotnoEditor;